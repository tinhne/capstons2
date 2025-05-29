package com.prediction.backend.services.impl;

import com.prediction.backend.dto.request.DiseaseRequest;
import com.prediction.backend.dto.response.DiseaseResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Disease;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.repositories.DiseaseRepository;
import com.prediction.backend.repositories.DiseaseSymptomRepository;
import com.prediction.backend.services.DiseaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of the DiseaseService interface.
 * Provides business logic for managing disease data.
 */
@Service
@Slf4j
public class DiseaseServiceImpl implements DiseaseService {

    private final DiseaseRepository diseaseRepository;
    private final DiseaseSymptomRepository diseaseSymptomRepository;

    /**
     * Constructs a DiseaseServiceImpl with the required repositories.
     */
    @Autowired
    public DiseaseServiceImpl(DiseaseRepository diseaseRepository,
            DiseaseSymptomRepository diseaseSymptomRepository) {
        this.diseaseRepository = diseaseRepository;
        this.diseaseSymptomRepository = diseaseSymptomRepository;
    }

    /**
     * Retrieves all diseases from the database.
     */
    @Override
    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    /**
     * Retrieves a disease by its unique identifier.
     */
    @Override
    public Optional<Disease> getDiseaseById(String diseaseId) {
        return diseaseRepository.findById(diseaseId);
    }

    /**
     * Get detailed information of a disease by ID, including symptoms
     */
    @Override
    public DiseaseResponse getDiseaseDetailsById(String diseaseId) throws AppException {
        Disease disease = diseaseRepository.findById(diseaseId)
                .orElseThrow(() -> new AppException(ErrorCode.DISEASE_NOT_FOUND));

        List<Symptom> symptoms = extractSymptomsFromResult(diseaseSymptomRepository.findByDiseaseId(diseaseId));

        return DiseaseResponse.fromEntityWithSymptoms(disease, symptoms);
    }

    /**
     * Extract a list of Symptom from the Repository query result
     */
    private List<Symptom> extractSymptomsFromResult(List<Map<String, Object>> resultList) {
        List<Symptom> symptoms = new ArrayList<>();

        for (Map<String, Object> result : resultList) {
            try {
                Symptom symptom = new Symptom();
                // Set values from map to symptom
                if (result.containsKey("symptom_id")) {
                    symptom.setSymptomId(result.get("symptom_id").toString());
                }
                if (result.containsKey("symptom_name")) {
                    symptom.setNameEn(result.get("symptom_name").toString());
                }
                // Add other properties if needed

                symptoms.add(symptom);
            } catch (Exception e) {
                log.error("Error converting result to Symptom: {}", e.getMessage());
            }
        }

        return symptoms;
    }

    /**
     * Retrieves diseases by their English name.
     */
    @Override
    public List<Disease> getDiseasesByNameEn(String nameEn) {
        return diseaseRepository.findByNameEnIgnoreCase(nameEn);
    }

    /**
     * Retrieves diseases by their Vietnamese name.
     */
    @Override
    public List<Disease> getDiseasesByNameVn(String nameVn) {
        return diseaseRepository.findByNameVnIgnoreCase(nameVn);
    }

    /**
     * Search diseases by keyword
     */
    @Override
    public List<Disease> searchDiseases(String keyword) {
        return diseaseRepository.searchByKeyword(keyword);
    }

    /**
     * Retrieves diseases by their severity level.
     */
    @Override
    public List<Disease> getDiseasesBySeverity(Disease.Severity severity) {
        return diseaseRepository.findBySeverity(severity);
    }

    /**
     * Retrieves diseases by their specialization.
     */
    @Override
    public List<Disease> getDiseasesBySpecialization(String specialization) {
        return diseaseRepository.findBySpecialization(specialization);
    }

    /**
     * Creates a new disease.
     */
    @Override
    public DiseaseResponse createDisease(DiseaseRequest diseaseRequest) throws AppException {
        try {
            // Check if the disease name already exists
            if (!diseaseRepository.findByNameEnIgnoreCase(diseaseRequest.getNameEn()).isEmpty()) {
                throw new AppException(ErrorCode.DISEASE_NAME_EN_EXISTED);
            }

            if (diseaseRequest.getNameVn() != null &&
                    !diseaseRepository.findByNameVnIgnoreCase(diseaseRequest.getNameVn()).isEmpty()) {
                throw new AppException(ErrorCode.DISEASE_NAME_VN_EXISTED);
            }

            // Create new entity
            Disease disease = new Disease();
            disease.setDiseaseId(UUID.randomUUID().toString().substring(0, 20));
            disease.setOriginalId(diseaseRequest.getOriginalId());
            disease.setNameEn(diseaseRequest.getNameEn());
            disease.setNameVn(diseaseRequest.getNameVn());
            disease.setDescriptionEn(diseaseRequest.getDescriptionEn());
            disease.setDescriptionVn(diseaseRequest.getDescriptionVn());
            disease.setSeverity(diseaseRequest.getSeverity());
            disease.setSpecialization(diseaseRequest.getSpecialization());

            // Save to database
            Disease savedDisease = diseaseRepository.save(disease);

            return DiseaseResponse.fromEntity(savedDisease);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating disease: ", e);
            throw new AppException(ErrorCode.DISEASE_PROCESSING_ERROR);
        }
    }

    /**
     * Updates an existing disease.
     */
    @Override
    public DiseaseResponse updateDisease(String diseaseId, DiseaseRequest diseaseRequest) throws AppException {
        try {
            // Find disease by ID
            Disease existingDisease = diseaseRepository.findById(diseaseId)
                    .orElseThrow(() -> new AppException(ErrorCode.DISEASE_NOT_FOUND));

            // Check if the updated name conflicts
            List<Disease> diseasesWithSameNameEn = diseaseRepository.findByNameEnIgnoreCase(diseaseRequest.getNameEn());
            if (!diseasesWithSameNameEn.isEmpty() &&
                    !diseasesWithSameNameEn.get(0).getDiseaseId().equals(diseaseId)) {
                throw new AppException(ErrorCode.DISEASE_NAME_EN_EXISTED);
            }

            if (diseaseRequest.getNameVn() != null) {
                List<Disease> diseasesWithSameNameVn = diseaseRepository
                        .findByNameVnIgnoreCase(diseaseRequest.getNameVn());
                if (!diseasesWithSameNameVn.isEmpty() &&
                        !diseasesWithSameNameVn.get(0).getDiseaseId().equals(diseaseId)) {
                    throw new AppException(ErrorCode.DISEASE_NAME_VN_EXISTED);
                }
            }

            // Update information
            existingDisease.setOriginalId(diseaseRequest.getOriginalId());
            existingDisease.setNameEn(diseaseRequest.getNameEn());
            existingDisease.setNameVn(diseaseRequest.getNameVn());
            existingDisease.setDescriptionEn(diseaseRequest.getDescriptionEn());
            existingDisease.setDescriptionVn(diseaseRequest.getDescriptionVn());
            existingDisease.setSeverity(diseaseRequest.getSeverity());
            existingDisease.setSpecialization(diseaseRequest.getSpecialization());

            // Save to database
            Disease updatedDisease = diseaseRepository.save(existingDisease);

            return DiseaseResponse.fromEntity(updatedDisease);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error updating disease: ", e);
            throw new AppException(ErrorCode.DISEASE_PROCESSING_ERROR);
        }
    }

    /**
     * Deletes a disease.
     */
    @Override
    public void deleteDisease(String diseaseId) throws AppException {
        // Check if the disease exists
        if (!diseaseRepository.existsById(diseaseId)) {
            throw new AppException(ErrorCode.DISEASE_NOT_FOUND);
        }

        try {
            // Delete disease
            diseaseRepository.deleteById(diseaseId);
        } catch (Exception e) {
            log.error("Error deleting disease: ", e);
            throw new AppException(ErrorCode.DISEASE_PROCESSING_ERROR);
        }
    }

    @Override
    public Page<Disease> getDiseasesPaging(Pageable pageable) {
        return diseaseRepository.findAll(pageable);
    }

    @Override
    public Page<Disease> searchDiseasesPaging(String keyword, Pageable pageable) {
        return diseaseRepository.findByNameEnContainingIgnoreCaseOrNameVnContainingIgnoreCase(keyword, keyword, pageable);
    }
}