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
     * Retrieve list of disease
     */
    @GetMapping("/diseases")
    public ApiResponse<List<Disease>> getAllDiseases() {
        List<Disease> diseases = diseaseService.getAllDiseases();

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Đã tìm thấy " + diseases.size() + " bệnh")
                .data(diseases)
                .build();
    }

    /**
     * Lấy thông tin chi tiết của một bệnh theo ID
     */
    @GetMapping("/diseases/{id}")
    public ApiResponse<DiseaseResponse> getDiseaseById(@PathVariable("id") String diseaseId) {
        try {
            DiseaseResponse disease = diseaseService.getDiseaseDetailsById(diseaseId);

            return ApiResponse.<DiseaseResponse>builder()
                    .status(1000)
                    .message("Đã tìm thấy bệnh")
                    .data(disease)
                    .build();
        } catch (AppException e) {
            throw e;
        }
    }

    /**
     * Tìm bệnh theo tên tiếng Anh
     */
    @GetMapping("/diseases/name-en/{name}")
    public ApiResponse<List<Disease>> getDiseasesByNameEn(@PathVariable("name") String name) {
        List<Disease> diseases = diseaseService.getDiseasesByNameEn(name);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Tìm thấy " + diseases.size() + " bệnh theo tên tiếng Anh: " + name)
                .data(diseases)
                .build();
    }

    /**
     * Tìm bệnh theo tên tiếng Việt
     */
    @GetMapping("/diseases/name-vn/{name}")
    public ApiResponse<List<Disease>> getDiseasesByNameVn(@PathVariable("name") String name) {
        List<Disease> diseases = diseaseService.getDiseasesByNameVn(name);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Tìm thấy " + diseases.size() + " bệnh theo tên tiếng Việt: " + name)
                .data(diseases)
                .build();
    }

    /**
     * Tìm kiếm bệnh theo từ khóa
     */
    @GetMapping("/diseases/search")
    public ApiResponse<List<Disease>> searchDiseases(@RequestParam("keyword") String keyword) {
        List<Disease> diseases = diseaseService.searchDiseases(keyword);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Tìm thấy " + diseases.size() + " bệnh theo từ khóa: " + keyword)
                .data(diseases)
                .build();
    }

    /**
     * Tìm bệnh theo mức độ nghiêm trọng
     */
    @GetMapping("/diseases/severity/{severity}")
    public ApiResponse<List<Disease>> getDiseasesBySeverity(@PathVariable("severity") String severity) {
        try {
            Disease.Severity severityEnum = Disease.Severity.valueOf(severity.toUpperCase());
            List<Disease> diseases = diseaseService.getDiseasesBySeverity(severityEnum);

            return ApiResponse.<List<Disease>>builder()
                    .status(1000)
                    .message("Tìm thấy " + diseases.size() + " bệnh với mức độ nghiêm trọng: " + severity)
                    .data(diseases)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_SEVERITY);
        }
    }

    /**
     * Tìm bệnh theo chuyên khoa
     */
    @GetMapping("/diseases/specialization/{specialization}")
    public ApiResponse<List<Disease>> getDiseasesBySpecialization(
            @PathVariable("specialization") String specialization) {
        List<Disease> diseases = diseaseService.getDiseasesBySpecialization(specialization);

        return ApiResponse.<List<Disease>>builder()
                .status(1000)
                .message("Tìm thấy " + diseases.size() + " bệnh theo chuyên khoa: " + specialization)
                .data(diseases)
                .build();
    }

    /**
     * Tạo bệnh mới
     */
    @PostMapping("/diseases")
    public ResponseEntity<ApiResponse<DiseaseResponse>> createDisease(
            @Valid @RequestBody DiseaseRequest diseaseRequest) {
        DiseaseResponse diseaseResponse = diseaseService.createDisease(diseaseRequest);

        ApiResponse<DiseaseResponse> response = ApiResponse.<DiseaseResponse>builder()
                .status(1000)
                .message("Tạo bệnh mới thành công")
                .data(diseaseResponse)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật thông tin bệnh
     */
    @PutMapping("/diseases/{id}")
    public ApiResponse<DiseaseResponse> updateDisease(
            @PathVariable("id") String diseaseId,
            @Valid @RequestBody DiseaseRequest diseaseRequest) {

        DiseaseResponse diseaseResponse = diseaseService.updateDisease(diseaseId, diseaseRequest);

        return ApiResponse.<DiseaseResponse>builder()
                .status(1000)
                .message("Cập nhật bệnh thành công")
                .data(diseaseResponse)
                .build();
    }

    /**
     * Xóa bệnh
     */
    @DeleteMapping("/diseases/{id}")
    public ApiResponse<Void> deleteDisease(@PathVariable("id") String diseaseId) {
        diseaseService.deleteDisease(diseaseId);

        return ApiResponse.<Void>builder()
                .status(1000)
                .message("Đã xóa bệnh thành công")
                .build();
    }
}