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

        // ✅ Filter chung: loại bỏ status "pending"
        List<PatientCase> filteredList = list.stream()
                .filter(pc -> pc.getStatus() == null || !"pending".equalsIgnoreCase(pc.getStatus().trim()))
                .collect(Collectors.toList());

        Map<String, Long> diseaseData = filteredList.stream()
                .filter(pc -> pc.getPredictedDisease() != null && !pc.getPredictedDisease().trim().isEmpty())
                .collect(Collectors.groupingBy(PatientCase::getPredictedDisease, Collectors.counting()));

        Map<String, Long> regionData = filteredList.stream()
                .filter(pc -> pc.getLocation() != null)
                .collect(Collectors.groupingBy(pc -> classifyRegion(pc.getLocation()), Collectors.counting()));

        Map<String, Long> ageGroupData = filteredList.stream()
                .filter(pc -> pc.getAge() != null)
                .collect(Collectors.groupingBy(pc -> classifyAgeGroup(pc.getAge()), Collectors.counting()));

        // ✅ Sử dụng raw season data từ database
        Map<String, Long> seasonData = filteredList.stream()
                .filter(pc -> pc.getSeason() != null && !pc.getSeason().trim().isEmpty())
                .collect(Collectors.groupingBy(PatientCase::getSeason, Collectors.counting()));

        // ✅ Thêm dữ liệu bệnh theo mùa - FIX: sử dụng raw season từ DB
        Map<String, Map<String, Long>> diseaseBySeasonData = getTopDiseasesBySeasonRaw(filteredList);

        // ✅ Thêm dữ liệu bệnh theo vùng miền
        Map<String, Map<String, Long>> diseaseByRegionData = getTopDiseasesByRegion(filteredList);

        Map<String, Object> result = new HashMap<>();
        result.put("regionData", regionData);
        result.put("ageGroupData", ageGroupData);
        result.put("seasonData", seasonData);
        result.put("diseaseData", diseaseData);
        result.put("diseaseBySeasonData", diseaseBySeasonData);
        result.put("diseaseByRegionData", diseaseByRegionData);

        return result;
    }

    // ✅ NEW: Method sử dụng raw season data từ database
    private Map<String, Map<String, Long>> getTopDiseasesBySeasonRaw(List<PatientCase> filteredList) {
        Map<String, Map<String, Long>> result = new HashMap<>();

        // ✅ Sử dụng exact season names từ database
        List<String> seasons = List.of("Đông-Xuân", "Xuân-Hè", "Hè-Thu", "Thu-Đông");

        for (String season : seasons) {
            Map<String, Long> diseasesInSeason = filteredList.stream()
                    .filter(pc -> pc.getSeason() != null && !pc.getSeason().trim().isEmpty())
                    .filter(pc -> season.equals(pc.getSeason().trim())) // ✅ Exact match
                    .filter(pc -> pc.getPredictedDisease() != null && !pc.getPredictedDisease().trim().isEmpty())
                    .collect(Collectors.groupingBy(PatientCase::getPredictedDisease, Collectors.counting()));

            Map<String, Long> topDiseases = diseasesInSeason.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (e1, e2) -> e1,
                            HashMap::new));

            result.put(season, topDiseases);
        }

        return result;
    }

    // ✅ Method để lấy top bệnh theo vùng miền (không thay đổi)
    private Map<String, Map<String, Long>> getTopDiseasesByRegion(List<PatientCase> filteredList) {
        Map<String, Map<String, Long>> result = new HashMap<>();

        List<String> regions = List.of("Miền Bắc", "Miền Trung", "Miền Nam", "Khác");

        for (String region : regions) {
            Map<String, Long> diseasesInRegion = filteredList.stream()
                    .filter(pc -> pc.getLocation() != null)
                    .filter(pc -> region.equals(classifyRegion(pc.getLocation())))
                    .filter(pc -> pc.getPredictedDisease() != null && !pc.getPredictedDisease().trim().isEmpty())
                    .collect(Collectors.groupingBy(PatientCase::getPredictedDisease, Collectors.counting()));

            Map<String, Long> topDiseases = diseasesInRegion.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(7)
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (e1, e2) -> e1,
                            HashMap::new));

            result.put(region, topDiseases);
        }

        return result;
    }

    private String classifyRegion(String location) {
        if (location == null || location.trim().isEmpty()) {
            return "Không rõ";
        }

        String normalizedLocation = location.trim();

        if (List.of("Hà Nội", "Hải Phòng", "Quảng Ninh", "Hải Dương", "Nam Định", "Thái Bình")
                .contains(normalizedLocation))
            return "Miền Bắc";
        if (List.of("Đà Nẵng", "Huế", "Nha Trang", "Vũng Tàu", "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên",
                "Khánh Hòa").contains(normalizedLocation))
            return "Miền Trung";
        if (List.of("TP.HCM", "Cần Thơ", "An Giang", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu", "Long An",
                "Tiền Giang").contains(normalizedLocation))
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