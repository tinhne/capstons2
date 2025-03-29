package com.prediction.backend.services;

import java.util.List;
import java.util.Map;

/**
 * Service interface for managing the relationship between diseases and symptoms.
 * Provides methods to retrieve disease-symptom associations based on disease or symptom criteria.
 */
public interface DiseaseSymptomService {

    /**
     * Retrieves a list of disease-symptom associations for a given disease ID.
     * Each association is represented as a map containing disease and symptom details.
     *
     * @param diseaseId The ID of the disease.
     * @return A list of maps, where each map represents a disease-symptom association.
     * Returns an empty list if no associations are found.
     */
    List<Map<String, Object>> getDiseaseSymptomsByDiseaseId(String diseaseId);

    /**
     * Retrieves a list of disease-symptom associations for a given symptom ID.
     * Each association is represented as a map containing disease and symptom details.
     *
     * @param symptomId The ID of the symptom.
     * @return A list of maps, where each map represents a disease-symptom association.
     * Returns an empty list if no associations are found.
     */
    List<Map<String, Object>> getDiseaseSymptomsBySymptomId(String symptomId);

    /**
     * Retrieves a list of disease-symptom associations for a list of symptom IDs.
     * Each association is represented as a map containing disease and symptom details.
     *
     * @param symptomIds A list of symptom IDs.
     * @return A list of maps, where each map represents a disease-symptom association.
     * Returns an empty list if no associations are found.
     */
    List<Map<String, Object>> getDiseaseSymptomsBySymptomIds(List<String> symptomIds);
}