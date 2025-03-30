package com.prediction.backend.controllers;

import com.prediction.backend.dto.request.DiagnosisRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.DiagnosisResponse;
import com.prediction.backend.models.Disease;
import com.prediction.backend.services.DiagnosisService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for handling disease diagnosis based on symptoms.
 * Provides an endpoint to diagnose potential diseases from a list of symptom
 * names.
 */
@RestController
@RequestMapping("/api")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    /**
     * Constructs a DiagnosisController with the required DiagnosisService.
     *
     * @param diagnosisService the service for diagnosing diseases based on symptoms
     */
    @Autowired
    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    /**
     * Diagnoses potential diseases based on a list of symptom names provided by the
     * user.
     *
     * @param symptomNames a list of symptom names (e.g., ["fever", "cough",
     *                     "headache"])
     * @param path         the request path, retrieved from the X-Request-Path
     *                     header (defaults to "/api/diagnosis")
     * @return ResponseEntity containing an ApiResponse with a list of potential
     *         diseases or an error message
     */
    @PostMapping("/diagnosis")
    public ApiResponse<DiagnosisResponse> diagnose(
            @Valid @RequestBody DiagnosisRequest diagnosisRequest) {

        // Gọi service để thực hiện chẩn đoán 
        DiagnosisResponse diagnosisResponse = diagnosisService.diagnose(diagnosisRequest);

        // Trả về kết quả thành công với message từ response
        return ApiResponse.<DiagnosisResponse>builder()
                .status(1000) // Mã thành công
                .message(diagnosisResponse.getMessage()) // Sử dụng message từ response
                .data(diagnosisResponse)
                .build();
    }

    // @PostMapping("/diagnosis")
    // public ResponseEntity<ApiResponse<List<Disease>>> diagnose(
    // @RequestBody List<String> symptomNames,
    // @RequestHeader(value = "X-Request-Path", defaultValue = "/api/diagnosis")
    // String path) {

    // // Check input data
    // if (symptomNames == null || symptomNames.isEmpty()) {
    // ApiResponse<List<Disease>> errorResponse = ApiResponse.error(
    // HttpStatus.BAD_REQUEST,
    // "INVALID_INPUT",
    // "Symptom list cannot be null or empty",
    // path);
    // return ResponseEntity.badRequest().body(errorResponse);
    // }

    // // Call DiagnosisService to diagnose
    // List<Disease> diseases = diagnosisService.diagnose(symptomNames);

    // // Check result
    // if (diseases.isEmpty()) {
    // ApiResponse<List<Disease>> errorResponse = ApiResponse.error(
    // HttpStatus.NOT_FOUND,
    // "NO_DISEASES_FOUND",
    // "No diseases found matching the provided symptoms",
    // path);
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    // }

    // // Return successful result
    // ApiResponse<List<Disease>> response = ApiResponse.success(diseases, path);
    // return ResponseEntity.ok(response);
    // }
}