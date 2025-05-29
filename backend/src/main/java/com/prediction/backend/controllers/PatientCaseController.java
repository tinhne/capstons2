package com.prediction.backend.controllers;

import com.prediction.backend.models.PatientCase;
import com.prediction.backend.repositories.PatientCaseRepository;
import com.prediction.backend.dto.request.UpdatePatientCaseRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.DiagnoseDiseaseResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/patient-cases")
public class PatientCaseController {

        @Autowired
        private PatientCaseRepository patientCaseRepository;

        // Lấy danh sách log theo id_notification
        @GetMapping("/by-notification/{notificationId}")
        public ApiResponse<DiagnoseDiseaseResponse> getLogsByNotification(@PathVariable String notificationId) {
                PatientCase logs = patientCaseRepository.findByNotification_Id(notificationId);
                DiagnoseDiseaseResponse diseaseResponse = DiagnoseDiseaseResponse.builder()
                                .id(logs.getId())
                                .gender(logs.getGender())
                                .age(logs.getAge())
                                .location(logs.getLocation())
                                .symptomStartTime(logs.getSymptomStartTime())
                                .Symptoms(logs.getSymptoms())
                                .riskFactors(logs.getRiskFactors())
                                .build();
                return ApiResponse.<DiagnoseDiseaseResponse>builder()
                                .message("Danh sách log theo notification")
                                .data(diseaseResponse)
                                .build();
        }

        // Update log theo id
        @PutMapping("/{id}")
        public ApiResponse<PatientCase> updateLog(
                        @PathVariable Long id,
                        @RequestBody UpdatePatientCaseRequest updateRequest) {
                PatientCase log = patientCaseRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy log"));
                // Cập nhật các trường cần thiết, ví dụ:
                log.setPredictedDisease(updateRequest.getPredictedDisease());
                log.setSymptoms(updateRequest.getSymptoms());
                log.setRiskFactors(updateRequest.getRiskFactors());
                log.setUpdatedAt(LocalDateTime.now());
                // ... các trường khác nếu cần

                patientCaseRepository.save(log);
                return ApiResponse.<PatientCase>builder()
                                .message("Cập nhật log thành công")
                                .data(log)
                                .build();
        }
}