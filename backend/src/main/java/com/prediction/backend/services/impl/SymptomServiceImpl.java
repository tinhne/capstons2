package com.prediction.backend.services.impl;

import com.prediction.backend.dto.response.SymptomResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.repositories.SymptomRepository;
import com.prediction.backend.services.SymptomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the SymptomService interface.
 * Provides business logic for managing symptom data.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SymptomServiceImpl implements SymptomService {

    private final SymptomRepository symptomRepository;

    /**
     * Retrieves all symptoms from the database and converts them to DTO format.
     */
    @Override
    public List<SymptomResponse> getAllSymptoms() {
        log.info("Retrieving all symptoms");
        List<Symptom> symptoms = symptomRepository.findAll();
        return symptoms.stream()
                .map(SymptomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a symptom by its unique identifier and converts it to DTO format.
     */
    @Override
    public SymptomResponse getSymptomById(String symptomId) {
        log.info("Retrieving symptom with ID: {}", symptomId);

        return symptomRepository.findById(symptomId)
                .map(SymptomResponse::fromEntity)
                .orElseThrow(() -> new AppException(ErrorCode.SYMPTOM_NOT_FOUND));
    }

    /**
     * Retrieves symptoms by their English name, ignoring case sensitivity, and
     * converts to DTO format.
     */
    @Override
    public List<SymptomResponse> getSymptomsByNameEn(String nameEn) {
        log.info("Searching for symptoms with English name: {}", nameEn);

        List<Symptom> symptoms = symptomRepository.findByNameEnIgnoreCase(nameEn);
        return symptoms.stream()
                .map(SymptomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves symptoms by their Vietnamese name, ignoring case sensitivity, and
     * converts to DTO format.
     */
    @Override
    public List<SymptomResponse> getSymptomsByNameVn(String nameVn) {
        log.info("Searching for symptoms with Vietnamese name: {}", nameVn);

        List<Symptom> symptoms = symptomRepository.findByNameVnIgnoreCase(nameVn);
        return symptoms.stream()
                .map(SymptomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves symptoms by their frequency of occurrence and converts to DTO
     * format.
     */
    @Override
    public List<SymptomResponse> getSymptomsByFrequency(String frequency) {
        log.info("Searching for symptoms with frequency: {}", frequency);

        // Validate the frequency value before processing
        try {
            Symptom.Frequency frequencyEnum = Symptom.Frequency.valueOf(frequency.toUpperCase());
            List<Symptom> symptoms = symptomRepository.findByFrequency(frequencyEnum);
            return symptoms.stream()
                    .map(SymptomResponse::fromEntity)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.error("Invalid frequency value: {}", frequency);
            throw new AppException(ErrorCode.INVALID_FREQUENCY_VALUE);
        }
    }

    /**
     * Retrieves symptoms by searching for a keyword within their synonyms and
     * converts to DTO format.
     */
    @Override
    public List<SymptomResponse> getSymptomsBySynonym(String keyword) {
        log.info("Searching for symptoms with synonym containing: {}", keyword);

        List<Symptom> symptoms = symptomRepository.findBySynonymContaining(keyword);
        return symptoms.stream()
                .map(SymptomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Page<SymptomResponse> getSymptomsPaging(Pageable pageable) {
        return symptomRepository.findAll(pageable)
                .map(SymptomResponse::fromEntity);
    }

    @Override
    public Page<SymptomResponse> searchSymptomsPaging(String keyword, Pageable pageable) {
        return symptomRepository.findByNameEnContainingIgnoreCaseOrNameVnContainingIgnoreCase(keyword, keyword,
                pageable);
    }
}