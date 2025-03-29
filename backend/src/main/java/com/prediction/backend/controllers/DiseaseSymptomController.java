package com.prediction.backend.controllers;

import com.prediction.backend.services.DiseaseSymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing disease-symptom relationships.
 * Provides endpoints to retrieve disease-symptom associations based on disease or symptom IDs.
 */
@RestController
@RequestMapping("/api/disease-symptom")
public class DiseaseSymptomController {

    private final DiseaseSymptomService diseaseSymptomService;

    @Autowired
    public DiseaseSymptomController(DiseaseSymptomService diseaseSymptomService) {
        this.diseaseSymptomService = diseaseSymptomService;
    }

    /**
     * Retrieves a list of disease-symptom associations for a given disease ID.
     *
     * @param diseaseId The ID of the disease.
     * @return A list of maps, where each map represents a disease-symptom association.
     */
    @GetMapping("/disease/{diseaseId}")
    public List<Map<String, Object>> getDiseaseSymptomsByDiseaseId(@PathVariable String diseaseId) {
        return diseaseSymptomService.getDiseaseSymptomsByDiseaseId(diseaseId);
    }

    /**
     * Retrieves a list of disease-symptom associations for a given symptom ID.
     *
     * @param symptomId The ID of the symptom.
     * @return A list of maps, where each map represents a disease-symptom association.
     */
    @GetMapping("/symptom/{symptomId}")
    public List<Map<String, Object>> getDiseaseSymptomsBySymptomId(@PathVariable String symptomId) {
        return diseaseSymptomService.getDiseaseSymptomsBySymptomId(symptomId);
    }

    /**
     * Retrieves a list of disease-symptom associations for a list of symptom IDs.
     *
     * @param symptomIds A list of symptom IDs.
     * @return A list of maps, where each map represents a disease-symptom association.
     */
    @PostMapping("/symptoms")
    public List<Map<String, Object>> getDiseaseSymptomsBySymptomIds(@RequestBody List<String> symptomIds) {
        return diseaseSymptomService.getDiseaseSymptomsBySymptomIds(symptomIds);
    }
}