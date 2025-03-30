package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.SymptomResponse;
import com.prediction.backend.services.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing symptom-related operations.
 * Provides endpoints to retrieve symptom data based on various criteria.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SymptomController {

    private final SymptomService symptomService;

    /**
     * Retrieves a list of all symptoms.
     *
     * @return ApiResponse with a list of all symptoms
     */
    @GetMapping("/symptoms")
    public ApiResponse<List<SymptomResponse>> getAllSymptoms() {
        List<SymptomResponse> symptoms = symptomService.getAllSymptoms();
        return ApiResponse.<List<SymptomResponse>>builder()
                .status(1000)
                .message("Successfully retrieved all symptoms")
                .data(symptoms)
                .build();
    }

    /**
     * Retrieves symptom information by ID.
     *
     * @param symptomId unique ID of the symptom
     * @return ApiResponse with symptom information
     */
    @GetMapping("/symptoms/{id}")
    public ApiResponse<SymptomResponse> getSymptomById(
            @PathVariable("id") String symptomId) {

        SymptomResponse symptom = symptomService.getSymptomById(symptomId);
        return ApiResponse.<SymptomResponse>builder()
                .status(1000)
                .message("Successfully retrieved symptom")
                .data(symptom)
                .build();
    }

    /**
     * Finds symptoms by English name.
     *
     * @param name English name of the symptom
     * @return ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/name-en/{name}")
    public ApiResponse<List<SymptomResponse>> getSymptomsByNameEn(
            @PathVariable("name") String name) {

        List<SymptomResponse> symptoms = symptomService.getSymptomsByNameEn(name);
        return ApiResponse.<List<SymptomResponse>>builder()
                .status(1000)
                .message("Successfully retrieved symptoms by English name")
                .data(symptoms)
                .build();
    }

    /**
     * Finds symptoms by Vietnamese name.
     *
     * @param name Vietnamese name of the symptom
     * @return ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/name-vn/{name}")
    public ApiResponse<List<SymptomResponse>> getSymptomsByNameVn(
            @PathVariable("name") String name) {

        List<SymptomResponse> symptoms = symptomService.getSymptomsByNameVn(name);
        return ApiResponse.<List<SymptomResponse>>builder()
                .status(1000)
                .message("Successfully retrieved symptoms by Vietnamese name")
                .data(symptoms)
                .build();
    }

    /**
     * Filters symptoms by frequency.
     *
     * @param frequency frequency level (e.g., "RARE", "FREQUENT")
     * @return ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/frequency/{frequency}")
    public ApiResponse<List<SymptomResponse>> getSymptomsByFrequency(
            @PathVariable("frequency") String frequency) {

        List<SymptomResponse> symptoms = symptomService.getSymptomsByFrequency(frequency);
        return ApiResponse.<List<SymptomResponse>>builder()
                .status(1000)
                .message("Successfully retrieved symptoms by frequency")
                .data(symptoms)
                .build();
    }

    /**
     * Finds symptoms by synonym.
     *
     * @param keyword keyword to search in the synonym list
     * @return ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/synonym/{keyword}")
    public ApiResponse<List<SymptomResponse>> getSymptomsBySynonym(
            @PathVariable("keyword") String keyword) {

        List<SymptomResponse> symptoms = symptomService.getSymptomsBySynonym(keyword);
        return ApiResponse.<List<SymptomResponse>>builder()
                .status(1000)
                .message("Successfully retrieved symptoms by synonym")
                .data(symptoms)
                .build();
    }
}