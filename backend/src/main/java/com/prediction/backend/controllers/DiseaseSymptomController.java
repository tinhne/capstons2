package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.services.DiseaseSymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing disease-symptom relationships.
 * Provides endpoints to retrieve disease-symptom associations based on disease
 * or symptom IDs.
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
     * @return A list of maps, where each map represents a disease-symptom
     *         association.
     */
    @GetMapping("/disease/{diseaseId}")
    public ApiResponse<List<Map<String, Object>>> getDiseaseSymptomsByDiseaseId(@PathVariable String diseaseId) {
        List<Map<String, Object>> associations = diseaseSymptomService.getDiseaseSymptomsByDiseaseId(diseaseId);
        return ApiResponse.<List<Map<String, Object>>>builder()
                .status(1000)
                .message("Successfully retrieved disease-symptom associations for disease ID: " + diseaseId)
                .data(associations)
                .build();
    }

    /**
     * Retrieves a list of disease-symptom associations for a given symptom ID.
     *
     * @param symptomId The ID of the symptom.
     * @return A list of maps, where each map represents a disease-symptom
     *         association.
     */
    @GetMapping("/symptom/{symptomId}")
    public ApiResponse<List<Map<String, Object>>> getDiseaseSymptomsBySymptomId(@PathVariable String symptomId) {
        List<Map<String, Object>> associations = diseaseSymptomService.getDiseaseSymptomsBySymptomId(symptomId);
        return ApiResponse.<List<Map<String, Object>>>builder()
                .status(1000)
                .message("Successfully retrieved disease-symptom associations for symptom ID: " + symptomId)
                .data(associations)
                .build();
    }

    /**
     * Retrieves a list of disease-symptom associations for a list of symptom IDs.
     *
     * @param symptomIds A list of symptom IDs.
     * @return A list of maps, where each map represents a disease-symptom
     *         association.
     */
    @PostMapping("/symptoms")
    public ApiResponse<List<Map<String, Object>>> getDiseaseSymptomsBySymptomIds(@RequestBody List<String> symptomIds) {
        List<Map<String, Object>> associations = diseaseSymptomService.getDiseaseSymptomsBySymptomIds(symptomIds);
        return ApiResponse.<List<Map<String, Object>>>builder()
                .status(1000)
                .message("Successfully retrieved disease-symptom associations for the provided symptom IDs")
                .data(associations)
                .build();
    }
}