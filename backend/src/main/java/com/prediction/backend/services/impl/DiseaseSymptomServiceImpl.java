package com.prediction.backend.services.impl;

import com.prediction.backend.repositories.DiseaseSymptomRepository;
import com.prediction.backend.services.DiseaseSymptomService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Service
public class DiseaseSymptomServiceImpl implements DiseaseSymptomService {

    private final DiseaseSymptomRepository diseaseSymptomRepository;

    @Autowired
    public DiseaseSymptomServiceImpl(DiseaseSymptomRepository diseaseSymptomRepository) {
        this.diseaseSymptomRepository = diseaseSymptomRepository;
    }

    @Override
    public List<Map<String, Object>> getDiseaseSymptomsByDiseaseId(String diseaseId) {
        return diseaseSymptomRepository.findByDiseaseId(diseaseId);
    }

    @Override
    public List<Map<String, Object>> getDiseaseSymptomsBySymptomId(String symptomId) {
        return diseaseSymptomRepository.findBySymptomId(symptomId);
    }

    @Override
    public List<Map<String, Object>> getDiseaseSymptomsBySymptomIds(List<String> symptomIds) {
        return diseaseSymptomRepository.findBySymptomIds(symptomIds);
    }
}