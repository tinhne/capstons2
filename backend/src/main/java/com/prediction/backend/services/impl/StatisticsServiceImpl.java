package com.prediction.backend.services.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prediction.backend.dto.response.AgeGroupStatDTO;
import com.prediction.backend.dto.response.DiseaseByLocationDTO;
import com.prediction.backend.dto.response.DiseaseBySeasonDTO;
import com.prediction.backend.dto.response.GenderStatDTO;
import com.prediction.backend.dto.response.WordCloudItemDTO;
import com.prediction.backend.models.PatientCase;
import com.prediction.backend.repositories.PatientCaseRepository;
import com.prediction.backend.services.StatisticsService;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
public class StatisticsServiceImpl implements StatisticsService {
    @Autowired
    private PatientCaseRepository repository;

    @Override
    public List<DiseaseBySeasonDTO> getDiseaseBySeasonStats() {
        List<PatientCase> records = repository.findAll();

        Map<String, Map<String, Long>> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        PatientCase::getSeason,
                        Collectors.groupingBy(PatientCase::getPredictedDisease,
                                Collectors.counting())));

        List<DiseaseBySeasonDTO> result = new ArrayList<>();
        grouped.forEach((season, diseaseMap) -> {
            diseaseMap.forEach((disease, count) -> {
                result.add(new DiseaseBySeasonDTO(season, disease, count));
            });
        });

        return result;
    }

    @Override
    public List<DiseaseByLocationDTO> getDiseaseByLocationStats() {
        List<PatientCase> records = repository.findAll();

        Map<String, Map<String, Long>> grouped = records.stream()
                .filter(pc -> pc.getLocation() != null && pc.getPredictedDisease() != null)
                .collect(Collectors.groupingBy(
                        PatientCase::getLocation,
                        Collectors.groupingBy(PatientCase::getPredictedDisease,
                                Collectors.counting())));

        List<DiseaseByLocationDTO> result = new ArrayList<>();
        grouped.forEach((location, diseaseMap) -> {
            diseaseMap.forEach((disease, count) -> {
                result.add(new DiseaseByLocationDTO(location, disease, count));
            });
        });

        return result;
    }

    @Override
    public List<WordCloudItemDTO> getSymptomWordCloud() {
        List<PatientCase> records = repository.findAll();
        Map<String, Integer> counter = new HashMap<>();

        for (PatientCase pc : records) {
            List<String> list = pc.getSymptoms();
            if (list == null)
                continue;
            for (String item : list) {
                String cleaned = item.trim().toLowerCase();
                counter.put(cleaned, counter.getOrDefault(cleaned, 0) + 1);
            }
        }

        return counter.entrySet().stream()
                .map(entry -> new WordCloudItemDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<WordCloudItemDTO> getRiskFactorWordCloud() {
        // List<PatientCase> records = repository.findAll();
        // Map<String, Integer> counter = new HashMap<>();

        // for (PatientCase pc : records) {
        // List<String> raw = pc.getRiskFactors();
        // if (raw == null)
        // continue;

        // try {
        // List<String> list = new ObjectMapper().readValue(raw, new
        // TypeReference<List<String>>() {
        // });
        // for (String item : list) {
        // String cleaned = item.trim().toLowerCase();
        // counter.put(cleaned, counter.getOrDefault(cleaned, 0) + 1);
        // }
        // } catch (Exception e) {
        // e.printStackTrace();
        // }
        // }
        List<PatientCase> records = repository.findAll();
        Map<String, Integer> counter = new HashMap<>();

        for (PatientCase pc : records) {
            List<String> list = pc.getSymptoms();
            if (list == null)
                continue;
            for (String item : list) {
                String cleaned = item.trim().toLowerCase();
                counter.put(cleaned, counter.getOrDefault(cleaned, 0) + 1);
            }
        }

        return counter.entrySet().stream()
                .map(entry -> new WordCloudItemDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<GenderStatDTO> getGenderStats() {
        List<PatientCase> records = repository.findAll();

        Map<String, Long> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        pc -> pc.getGender().toLowerCase(), Collectors.counting()));

        return grouped.entrySet().stream()
                .map(e -> new GenderStatDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AgeGroupStatDTO> getAgeGroupStats() {
        List<PatientCase> records = repository.findAll();

        Map<String, Long> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        pc -> {
                            int age = pc.getAge();
                            if (age < 10)
                                return "0-9";
                            if (age < 20)
                                return "10-19";
                            if (age < 30)
                                return "20-29";
                            if (age < 40)
                                return "30-39";
                            if (age < 50)
                                return "40-49";
                            if (age < 60)
                                return "50-59";
                            if (age < 70)
                                return "60-69";
                            return "70+";
                        },
                        Collectors.counting()));

        return grouped.entrySet().stream()
                .map(e -> new AgeGroupStatDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(AgeGroupStatDTO::getAgeGroup))
                .collect(Collectors.toList());
    }

}
