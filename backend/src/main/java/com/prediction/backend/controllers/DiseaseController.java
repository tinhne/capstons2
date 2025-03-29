package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.Disease;
import com.prediction.backend.services.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing disease-related operations.
 * Provides endpoints to retrieve disease data based on various criteria.
 */
@RestController
@RequestMapping("/api")
public class DiseaseController {

    private final DiseaseService diseaseService;

    /**
     * Constructs a DiseaseController with the required DiseaseService.
     *
     * @param diseaseService the service for handling disease-related business logic
     */
    @Autowired
    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    /**
     * Retrieves a list of all diseases.
     *
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases")
     * @return ResponseEntity containing an ApiResponse with the list of all diseases
     */
    @GetMapping("/diseases")
    public ResponseEntity<ApiResponse<List<Disease>>> getAllDiseases(
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases") String path) {
        List<Disease> diseases = diseaseService.getAllDiseases();
        ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves a disease by its unique identifier.
     *
     * @param diseaseId the unique identifier of the disease
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases/{id}")
     * @return ResponseEntity containing an ApiResponse with the disease details or an error if not found
     */
    @GetMapping("/diseases/{id}")
    public ResponseEntity<ApiResponse<Disease>> getDiseaseById(
            @PathVariable("id") String diseaseId,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases/{id}") String path) {
        Optional<Disease> disease = diseaseService.getDiseaseById(diseaseId);
        if (disease.isPresent()) {
            ApiResponse<Disease> response = ApiResponse.success(disease.get(), path);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<Disease> errorResponse = ApiResponse.error(
                    HttpStatus.NOT_FOUND,
                    "DISEASE_NOT_FOUND",
                    "Disease with ID " + diseaseId + " not found",
                    path
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Retrieves diseases by their English name.
     *
     * @param name the English name to search for
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases/name-en/{name}")
     * @return ResponseEntity containing an ApiResponse with the list of matching diseases
     */
    @GetMapping("/diseases/name-en/{name}")
    public ResponseEntity<ApiResponse<List<Disease>>> getDiseasesByNameEn(
            @PathVariable("name") String name,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases/name-en/{name}") String path) {
        List<Disease> diseases = diseaseService.getDiseasesByNameEn(name);
        ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves diseases by their Vietnamese name.
     *
     * @param name the Vietnamese name to search for
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases/name-vn/{name}")
     * @return ResponseEntity containing an ApiResponse with the list of matching diseases
     */
    @GetMapping("/diseases/name-vn/{name}")
    public ResponseEntity<ApiResponse<List<Disease>>> getDiseasesByNameVn(
            @PathVariable("name") String name,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases/name-vn/{name}") String path) {
        List<Disease> diseases = diseaseService.getDiseasesByNameVn(name);
        ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves diseases by their severity level.
     *
     * @param severity the severity level to filter by (e.g., "LOW", "MEDIUM", "HIGH")
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases/severity/{severity}")
     * @return ResponseEntity containing an ApiResponse with the list of matching diseases
     */
    @GetMapping("/diseases/severity/{severity}")
    public ResponseEntity<ApiResponse<List<Disease>>> getDiseasesBySeverity(
            @PathVariable("severity") String severity,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases/severity/{severity}") String path) {
        try {
            Disease.Severity severityEnum = Disease.Severity.valueOf(severity.toUpperCase());
            List<Disease> diseases = diseaseService.getDiseasesBySeverity(severityEnum);
            ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ApiResponse<List<Disease>> errorResponse = ApiResponse.error(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_SEVERITY",
                    "Invalid severity value: " + severity,
                    path
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Retrieves diseases by their associated medical specialization.
     *
     * @param specialization the medical specialization to filter by
     * @param path the request path, retrieved from the X-Request-Path header (defaults to "/api/diseases/specialization/{specialization}")
     * @return ResponseEntity containing an ApiResponse with the list of matching diseases
     */
    @GetMapping("/diseases/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<Disease>>> getDiseasesBySpecialization(
            @PathVariable("specialization") String specialization,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diseases/specialization/{specialization}") String path) {
        List<Disease> diseases = diseaseService.getDiseasesBySpecialization(specialization);
        ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
        return ResponseEntity.ok(response);
    }
}