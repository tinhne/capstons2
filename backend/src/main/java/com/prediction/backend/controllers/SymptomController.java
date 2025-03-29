package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.services.SymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing symptom-related operations.
 * Provides endpoints to retrieve symptom data based on various criteria.
 */
@RestController
@RequestMapping("/api")
public class SymptomController {

    private final SymptomService symptomService;

    /**
     * Initializes SymptomController with SymptomService injected via dependency injection.
     *
     * @param symptomService service handling symptom-related business logic
     */
    @Autowired
    public SymptomController(SymptomService symptomService) {
        this.symptomService = symptomService;
    }

    /**
     * Retrieves a list of all symptoms.
     *
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms")
     * @return ResponseEntity containing ApiResponse with a list of all symptoms
     */
    @GetMapping("/symptoms")
    public ResponseEntity<ApiResponse<List<Symptom>>> getAllSymptoms(
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms") String path) {
        List<Symptom> symptoms = symptomService.getAllSymptoms();
        ApiResponse<List<Symptom>> response = ApiResponse.success(symptoms, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves symptom information by ID.
     *
     * @param symptomId unique ID of the symptom
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms/{id}")
     * @return ResponseEntity containing ApiResponse with symptom information or an error if not found
     */
    @GetMapping("/symptoms/{id}")
    public ResponseEntity<ApiResponse<Symptom>> getSymptomById(
            @PathVariable("id") String symptomId,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms/{id}") String path) {
        Optional<Symptom> symptom = symptomService.getSymptomById(symptomId);
        if (symptom.isPresent()) {
            ApiResponse<Symptom> response = ApiResponse.success(symptom.get(), path);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<Symptom> errorResponse = ApiResponse.error(
                    HttpStatus.NOT_FOUND,
                    "SYMPTOM_NOT_FOUND",
                    "Symptom not found with ID " + symptomId,
                    path
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Finds symptoms by English name.
     *
     * @param name English name of the symptom
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms/name-en/{name}")
     * @return ResponseEntity containing ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/name-en/{name}")
    public ResponseEntity<ApiResponse<List<Symptom>>> getSymptomsByNameEn(
            @PathVariable("name") String name,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms/name-en/{name}") String path) {
        List<Symptom> symptoms = symptomService.getSymptomsByNameEn(name);
        ApiResponse<List<Symptom>> response = ApiResponse.success(symptoms, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Finds symptoms by Vietnamese name.
     *
     * @param name Vietnamese name of the symptom
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms/name-vn/{name}")
     * @return ResponseEntity containing ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/name-vn/{name}")
    public ResponseEntity<ApiResponse<List<Symptom>>> getSymptomsByNameVn(
            @PathVariable("name") String name,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms/name-vn/{name}") String path) {
        List<Symptom> symptoms = symptomService.getSymptomsByNameVn(name);
        ApiResponse<List<Symptom>> response = ApiResponse.success(symptoms, path);
        return ResponseEntity.ok(response);
    }

    /**
     * Filters symptoms by frequency.
     *
     * @param frequency frequency level (e.g., "RARE", "FREQUENT")
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms/frequency/{frequency}")
     * @return ResponseEntity containing ApiResponse with a list of matching symptoms or an error if frequency is invalid
     */
    @GetMapping("/symptoms/frequency/{frequency}")
    public ResponseEntity<ApiResponse<List<Symptom>>> getSymptomsByFrequency(
            @PathVariable("frequency") String frequency,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms/frequency/{frequency}") String path) {
        try {
            Symptom.Frequency frequencyEnum = Symptom.Frequency.valueOf(frequency.toUpperCase());
            List<Symptom> symptoms = symptomService.getSymptomsByFrequency(frequencyEnum);
            ApiResponse<List<Symptom>> response = ApiResponse.success(symptoms, path);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ApiResponse<List<Symptom>> errorResponse = ApiResponse.error(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_FREQUENCY",
                    "Invalid frequency value: " + frequency,
                    path
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Finds symptoms by synonym.
     *
     * @param keyword keyword to search in the synonym list
     * @param path request path, retrieved from the X-Request-Path header (defaults to "/api/symptoms/synonym/{keyword}")
     * @return ResponseEntity containing ApiResponse with a list of matching symptoms
     */
    @GetMapping("/symptoms/synonym/{keyword}")
    public ResponseEntity<ApiResponse<List<Symptom>>> getSymptomsBySynonym(
            @PathVariable("keyword") String keyword,
            @RequestHeader(value = "X-Request-Path", defaultValue = "/api/symptoms/synonym/{keyword}") String path) {
        List<Symptom> symptoms = symptomService.getSymptomsBySynonym(keyword);
        ApiResponse<List<Symptom>> response = ApiResponse.success(symptoms, path);
        return ResponseEntity.ok(response);
    }
}