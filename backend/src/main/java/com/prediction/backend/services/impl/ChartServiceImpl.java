package com.prediction.backend.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prediction.backend.models.PatientCase;
import com.prediction.backend.repositories.PatientCaseRepository;
import com.prediction.backend.services.ChartService;

@Service
public class ChartServiceImpl implements ChartService {
    @Autowired
    private PatientCaseRepository repo;

    @Override
    public Map<String, Object> getChartData() {
        List<PatientCase> list = repo.findAll();

        Map<String, Long> diseaseData = list.stream()
                .filter(pc -> pc.getPredictedDisease() != null)
                .collect(Collectors.groupingBy(PatientCase::getPredictedDisease, Collectors.counting()));

        Map<String, Long> regionData = list.stream()
                .filter(pc -> classifyRegion(pc.getLocation()) != null)
                .collect(Collectors.groupingBy(b -> classifyRegion(b.getLocation()), Collectors.counting()));

        Map<String, Long> ageGroupData = list.stream()
                .filter(pc -> classifyAgeGroup(pc.getAge()) != null)
                .collect(Collectors.groupingBy(b -> classifyAgeGroup(b.getAge()), Collectors.counting()));

        Map<String, Long> seasonData = list.stream()
                .filter(pc -> pc.getSeason() != null)
                .collect(Collectors.groupingBy(PatientCase::getSeason, Collectors.counting()));

        Map<String, Object> result = new HashMap<>();
        result.put("regionData", regionData);
        result.put("ageGroupData", ageGroupData);
        result.put("seasonData", seasonData);
        result.put("diseaseData", diseaseData);

        return result;
    }

    private String classifyRegion(String location) {
        if (List.of("Hà Nội", "Hải Phòng").contains(location))
            return "Miền Bắc";
        if (List.of("Đà Nẵng", "Huế", "Nha Trang", "Vũng Tàu").contains(location))
            return "Miền Trung";
        if (List.of("TP.HCM", "Cần Thơ").contains(location))
            return "Miền Nam";
        return "Khác";
    }

    private String classifyAgeGroup(Integer age) {
        if (age == null)
            return "Không rõ";
        if (age <= 12)
            return "Trẻ em";
        if (age <= 24)
            return "Thiếu niên";
        if (age <= 44)
            return "Thanh niên";
        if (age <= 64)
            return "Trung niên";
        return "Người cao tuổi";
    }
}
