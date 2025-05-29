package com.prediction.backend.controllers;

import com.prediction.backend.dto.request.DiseaseRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.DiseaseResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Disease;
import com.prediction.backend.services.DiseaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing disease-related operations.
 */
@RestController
@RequestMapping("/api")
public class DiseaseController {

    private final DiseaseService diseaseService;

    @Autowired
    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    /**
     * Retrieve list of diseases
     */
    @GetMapping("/diseases")
    public ApiResponse<List<Disease>> getAllDiseases() {
        List<Disease> diseases = diseaseService.getAllDiseases();

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.size() + " diseases")
                .data(diseases)
                .build();
    }

    @GetMapping("/diseases/paging")
    public ApiResponse<Page<Disease>> getDiseasesPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Disease> diseases = diseaseService.getDiseasesPaging(PageRequest.of(page, size));
        return ApiResponse.<Page<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.getTotalElements() + " diseases")
                .data(diseases)
                .build();
    }

    @GetMapping("/diseases/search-paging")
    public ApiResponse<Page<Disease>> searchDiseasesPaging(
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Disease> diseases = diseaseService.searchDiseasesPaging(keyword, PageRequest.of(page, size));
        return ApiResponse.<Page<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.getTotalElements() + " diseases by keyword: " + keyword)
                .data(diseases)
                .build();
    }

    /**
     * Get detailed information of a disease by ID
     */
    @GetMapping("/diseases/{id}")
    public ApiResponse<DiseaseResponse> getDiseaseById(@PathVariable("id") String diseaseId) {
        try {
            DiseaseResponse disease = diseaseService.getDiseaseDetailsById(diseaseId);

            return ApiResponse.<DiseaseResponse>builder()
                    .status(1000)
                    .message("Disease found")
                    .data(disease)
                    .build();
        } catch (AppException e) {
            throw e;
        }
    }

    /**
     * Find diseases by English name
     */
    @GetMapping("/diseases/name-en/{name}")
    public ApiResponse<List<Disease>> getDiseasesByNameEn(@PathVariable("name") String name) {
        List<Disease> diseases = diseaseService.getDiseasesByNameEn(name);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.size() + " diseases by English name: " + name)
                .data(diseases)
                .build();
    }

    /**
     * Find diseases by Vietnamese name
     */
    @GetMapping("/diseases/name-vn/{name}")
    public ApiResponse<List<Disease>> getDiseasesByNameVn(@PathVariable("name") String name) {
        List<Disease> diseases = diseaseService.getDiseasesByNameVn(name);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.size() + " diseases by Vietnamese name: " + name)
                .data(diseases)
                .build();
    }

    /**
     * Search diseases by keyword
     */
    @GetMapping("/diseases/search")
    public ApiResponse<List<Disease>> searchDiseases(@RequestParam("keyword") String keyword) {
        List<Disease> diseases = diseaseService.searchDiseases(keyword);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.size() + " diseases by keyword: " + keyword)
                .data(diseases)
                .build();
    }

    /**
     * Find diseases by severity
     */
    @GetMapping("/diseases/severity/{severity}")
    public ApiResponse<List<Disease>> getDiseasesBySeverity(@PathVariable("severity") String severity) {
        try {
            Disease.Severity severityEnum = Disease.Severity.valueOf(severity.toUpperCase());
            List<Disease> diseases = diseaseService.getDiseasesBySeverity(severityEnum);

            return ApiResponse.<List<Disease>>builder()
                    .status(1000)
                    .message("Found " + diseases.size() + " diseases with severity: " + severity)
                    .data(diseases)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_SEVERITY);
        }
    }

    /**
     * Find diseases by specialization
     */
    @GetMapping("/diseases/specialization/{specialization}")
    public ApiResponse<List<Disease>> getDiseasesBySpecialization(
            @PathVariable("specialization") String specialization) {
        List<Disease> diseases = diseaseService.getDiseasesBySpecialization(specialization);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Found " + diseases.size() + " diseases by specialization: " + specialization)
                .data(diseases)
                .build();
    }

    /**
     * Create a new disease
     */
    @PostMapping("/diseases")
    public ResponseEntity<ApiResponse<DiseaseResponse>> createDisease(
            @Valid @RequestBody DiseaseRequest diseaseRequest) {
        DiseaseResponse diseaseResponse = diseaseService.createDisease(diseaseRequest);

        ApiResponse<DiseaseResponse> response = ApiResponse.<DiseaseResponse>builder()
                .status(1000)
                .message("Successfully created new disease")
                .data(diseaseResponse)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update disease information
     */
    @PutMapping("/diseases/{id}")
    public ApiResponse<DiseaseResponse> updateDisease(
            @PathVariable("id") String diseaseId,
            @Valid @RequestBody DiseaseRequest diseaseRequest) {

        DiseaseResponse diseaseResponse = diseaseService.updateDisease(diseaseId, diseaseRequest);

        return ApiResponse.<DiseaseResponse>builder()
                .status(1000)
                .message("Disease updated successfully")
                .data(diseaseResponse)
                .build();
    }

    /**
     * Delete disease
     */
    @DeleteMapping("/diseases/{id}")
    public ApiResponse<Void> deleteDisease(@PathVariable("id") String diseaseId) {
        diseaseService.deleteDisease(diseaseId);

        return ApiResponse.<Void>builder()
                .status(1000)
                .message("Disease deleted successfully")
                .build();
    }
}