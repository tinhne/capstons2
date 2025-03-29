package com.prediction.backend.services.impl;

import com.prediction.backend.models.Disease;
import com.prediction.backend.repositories.DiseaseRepository;
import com.prediction.backend.services.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of the DiseaseService interface.
 * Provides business logic for managing disease data by interacting with the DiseaseRepository.
 */
@Service
public class DiseaseServiceImpl implements DiseaseService {

    private final DiseaseRepository diseaseRepository;

    /**
     * Constructs a DiseaseServiceImpl with the required DiseaseRepository.
     *
     * @param diseaseRepository the repository for accessing disease data
     */
    @Autowired
    public DiseaseServiceImpl(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    /**
     * Retrieves all diseases from the database.
     *
     * @return a list of all diseases
     */
    @Override
    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    /**
     * Retrieves a disease by its unique identifier.
     *
     * @param diseaseId the unique identifier of the disease
     * @return an Optional containing the disease if found, or empty if not found
     */
    @Override
    public Optional<Disease> getDiseaseById(String diseaseId) {
        return diseaseRepository.findById(diseaseId);
    }

    /**
     * Retrieves diseases by their English name, ignoring case sensitivity.
     *
     * @param nameEn the English name to search for
     * @return a list of diseases matching the provided English name
     */
    @Override
    public List<Disease> getDiseasesByNameEn(String nameEn) {
        return diseaseRepository.findByNameEnIgnoreCase(nameEn);
    }

    /**
     * Retrieves diseases by their Vietnamese name, ignoring case sensitivity.
     *
     * @param nameVn the Vietnamese name to search for
     * @return a list of diseases matching the provided Vietnamese name
     */
    @Override
    public List<Disease> getDiseasesByNameVn(String nameVn) {
        return diseaseRepository.findByNameVnIgnoreCase(nameVn);
    }

    /**
     * Retrieves diseases by their severity level.
     *
     * @param severity the severity level to filter by (e.g., LOW, MEDIUM, HIGH)
     * @return a list of diseases with the specified severity level
     */
    @Override
    public List<Disease> getDiseasesBySeverity(Disease.Severity severity) {
        return diseaseRepository.findBySeverity(severity);
    }

    /**
     * Retrieves diseases by their associated medical specialization.
     *
     * @param specialization the medical specialization to filter by
     * @return a list of diseases related to the specified specialization
     */
    @Override
    public List<Disease> getDiseasesBySpecialization(String specialization) {
        return diseaseRepository.findBySpecialization(specialization);
    }
}