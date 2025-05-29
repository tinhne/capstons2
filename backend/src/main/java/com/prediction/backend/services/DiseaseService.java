package com.prediction.backend.services;

import com.prediction.backend.dto.request.DiseaseRequest;
import com.prediction.backend.dto.response.DiseaseResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.models.Disease;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * Retrieves detailed information of a disease by its unique identifier,
     * including symptoms.
     *
     * @param diseaseId the unique identifier of the disease
     * @return a DiseaseResponse containing detailed information of the disease
     * @throws AppException if the disease is not found
     */
    DiseaseResponse getDiseaseDetailsById(String diseaseId) throws AppException;

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

    /**
     * Searches for diseases by a keyword.
     *
     * @param keyword the keyword to search for
     * @return a list of diseases matching the provided keyword
     */
    List<Disease> searchDiseases(String keyword);

    /**
     * Creates a new disease.
     *
     * @param diseaseRequest the request object containing disease details
     * @return a DiseaseResponse containing the created disease details
     * @throws AppException if there is an error during creation
     */
    DiseaseResponse createDisease(DiseaseRequest diseaseRequest) throws AppException;

    /**
     * Updates an existing disease.
     *
     * @param diseaseId      the unique identifier of the disease to update
     * @param diseaseRequest the request object containing updated disease details
     * @return a DiseaseResponse containing the updated disease details
     * @throws AppException if the disease is not found or there is an error during
     *                      update
     */
    DiseaseResponse updateDisease(String diseaseId, DiseaseRequest diseaseRequest) throws AppException;

    /**
     * Deletes a disease.
     *
     * @param diseaseId the unique identifier of the disease to delete
     * @throws AppException if the disease is not found or there is an error during
     *                      deletion
     */
    void deleteDisease(String diseaseId) throws AppException;

    Page<Disease> getDiseasesPaging(Pageable pageable);

    Page<Disease> searchDiseasesPaging(String keyword, Pageable pageable);
}