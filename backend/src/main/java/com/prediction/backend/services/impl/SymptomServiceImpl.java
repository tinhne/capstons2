package com.prediction.backend.services.impl;

import com.prediction.backend.models.Symptom;
import com.prediction.backend.repositories.SymptomRepository;
import com.prediction.backend.services.SymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of the SymptomService interface.
 * Provides business logic for managing symptom data by interacting with the SymptomRepository.
 */
@Service
public class SymptomServiceImpl implements SymptomService {

    private final SymptomRepository symptomRepository;

    /**
     * Constructs a SymptomServiceImpl with the required SymptomRepository.
     *
     * @param symptomRepository the repository for accessing symptom data
     */
    @Autowired
    public SymptomServiceImpl(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }

    @Override
    public List<Symptom> getAllSymptoms() {
        return symptomRepository.findAll();
    }

    @Override
    public Optional<Symptom> getSymptomById(String symptomId) {
        return symptomRepository.findById(symptomId);
    }

    @Override
    public List<Symptom> getSymptomsByNameEn(String nameEn) {
        return symptomRepository.findByNameEnIgnoreCase(nameEn);
    }

    @Override
    public List<Symptom> getSymptomsByNameVn(String nameVn) {
        return symptomRepository.findByNameVnIgnoreCase(nameVn);
    }

    @Override
    public List<Symptom> getSymptomsByFrequency(Symptom.Frequency frequency) {
        return symptomRepository.findByFrequency(frequency);
    }

    @Override
    public List<Symptom> getSymptomsBySynonym(String keyword) {
        return symptomRepository.findBySynonymContaining(keyword);
    }
}