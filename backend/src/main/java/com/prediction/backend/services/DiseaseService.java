package com.prediction.backend.services;

import com.prediction.backend.models.Disease;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing disease-related operations.
 * Defines methods for retrieving and manipulating disease data.
 */
public interface DiseaseService {

    /**
     * Retrieves all diseases from the database.
     *
     * @return a list of all diseases
     */
    List<Disease> getAllDiseases();

    /**
     * Retrieves a disease by its unique identifier.
     *
     * @param diseaseId the unique identifier of the disease
     * @return an Optional containing the disease if found, or empty if not found
     */
    Optional<Disease> getDiseaseById(String diseaseId);

    /**
     * Retrieves diseases by their English name, ignoring case sensitivity.
     *
     * @param nameEn the English name to search for
     * @return a list of diseases matching the provided English name
     */
    List<Disease> getDiseasesByNameEn(String nameEn);

    /**
     * Retrieves diseases by their Vietnamese name, ignoring case sensitivity.
     *
     * @param nameVn the Vietnamese name to search for
     * @return a list of diseases matching the provided Vietnamese name
     */
    List<Disease> getDiseasesByNameVn(String nameVn);

    /**
     * Retrieves diseases by their severity level.
     *
     * @param severity the severity level to filter by (e.g., LOW, MEDIUM, HIGH)
     * @return a list of diseases with the specified severity level
     */
    List<Disease> getDiseasesBySeverity(Disease.Severity severity);

    /**
     * Retrieves diseases by their associated medical specialization.
     *
     * @param specialization the medical specialization to filter by
     * @return a list of diseases related to the specified specialization
     */
    List<Disease> getDiseasesBySpecialization(String specialization);
}