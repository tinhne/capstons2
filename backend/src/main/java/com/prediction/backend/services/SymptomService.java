package com.prediction.backend.services;

import com.prediction.backend.dto.response.SymptomResponse;
import com.prediction.backend.models.Symptom;

import java.util.List;

/**
 * Service interface for managing symptom-related operations.
 * Defines methods for retrieving and searching symptom data.
 */
public interface SymptomService {

    /**
     * Retrieves all symptoms from the database and converts them to DTO format.
     *
     * @return a list of all symptoms as SymptomResponse DTOs
     */
    List<SymptomResponse> getAllSymptoms();

    /**
     * Retrieves a symptom by its unique identifier and converts it to DTO format.
     * Throws AppException with SYMPTOM_NOT_FOUND error code if not found.
     *
     * @param symptomId the unique identifier of the symptom
     * @return the symptom as SymptomResponse DTO
     */
    SymptomResponse getSymptomById(String symptomId);

    /**
     * Retrieves symptoms by their English name, ignoring case sensitivity, and
     * converts to DTO format.
     *
     * @param nameEn the English name to search for
     * @return a list of symptoms matching the provided English name as
     *         SymptomResponse DTOs
     */
    List<SymptomResponse> getSymptomsByNameEn(String nameEn);

    /**
     * Retrieves symptoms by their Vietnamese name, ignoring case sensitivity, and
     * converts to DTO format.
     *
     * @param nameVn the Vietnamese name to search for
     * @return a list of symptoms matching the provided Vietnamese name as
     *         SymptomResponse DTOs
     */
    List<SymptomResponse> getSymptomsByNameVn(String nameVn);

    /**
     * Retrieves symptoms by their frequency of occurrence and converts to DTO
     * format.
     * Validates the frequency string and throws AppException with
     * INVALID_FREQUENCY_VALUE error code if invalid.
     *
     * @param frequency the frequency level to filter by (e.g., "RARE",
     *                  "OCCASIONAL", "FREQUENT", "CONSTANT")
     * @return a list of symptoms with the specified frequency as SymptomResponse
     *         DTOs
     */
    List<SymptomResponse> getSymptomsByFrequency(String frequency);

    /**
     * Retrieves symptoms by searching for a keyword within their synonyms and
     * converts to DTO format.
     *
     * @param keyword the keyword to search for within the synonym field
     * @return a list of symptoms whose synonyms contain the provided keyword as
     *         SymptomResponse DTOs
     */
    List<SymptomResponse> getSymptomsBySynonym(String keyword);
}