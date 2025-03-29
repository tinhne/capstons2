package com.prediction.backend.services;

import com.prediction.backend.models.Symptom;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing symptom-related operations.
 * Defines methods for retrieving and searching symptom data.
 */
public interface SymptomService {

    /**
     * Retrieves all symptoms from the database.
     *
     * @return a list of all symptoms
     */
    List<Symptom> getAllSymptoms();

    /**
     * Retrieves a symptom by its unique identifier.
     *
     * @param symptomId the unique identifier of the symptom
     * @return an Optional containing the symptom if found, or empty if not found
     */
    Optional<Symptom> getSymptomById(String symptomId);

    /**
     * Retrieves symptoms by their English name, ignoring case sensitivity.
     *
     * @param nameEn the English name to search for
     * @return a list of symptoms matching the provided English name
     */
    List<Symptom> getSymptomsByNameEn(String nameEn);

    /**
     * Retrieves symptoms by their Vietnamese name, ignoring case sensitivity.
     *
     * @param nameVn the Vietnamese name to search for
     * @return a list of symptoms matching the provided Vietnamese name
     */
    List<Symptom> getSymptomsByNameVn(String nameVn);

    /**
     * Retrieves symptoms by their frequency of occurrence.
     *
     * @param frequency the frequency level to filter by (e.g., RARE, OCCASIONAL, FREQUENT, CONSTANT)
     * @return a list of symptoms with the specified frequency
     */
    List<Symptom> getSymptomsByFrequency(Symptom.Frequency frequency);

    /**
     * Retrieves symptoms by searching for a keyword within their synonyms.
     *
     * @param keyword the keyword to search for within the synonym field
     * @return a list of symptoms whose synonyms contain the provided keyword
     */
    List<Symptom> getSymptomsBySynonym(String keyword);
}