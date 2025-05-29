package com.prediction.backend.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.prediction.backend.dto.request.DiagnoseDiseaseRequest;
import com.prediction.backend.dto.request.DiagnosisRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.DiagnoseDiseaseResponse;
import com.prediction.backend.dto.response.GetAllDiagnoseDiseaseResponse; // Ensure this import is correct and matches the class definition
import com.prediction.backend.models.Disease;
import com.prediction.backend.models.DiseaseSymptom;
import com.prediction.backend.models.Notification;
import com.prediction.backend.models.PatientCase;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.DiseaseRepository;
import com.prediction.backend.repositories.DiseaseSymptomRepository;
import com.prediction.backend.repositories.NotificationRepository;
import com.prediction.backend.repositories.PatientCaseRepository;
import com.prediction.backend.repositories.SymptomRepository;
import com.prediction.backend.repositories.UserRepository;
import com.prediction.backend.services.PatientCaseService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class DiagnoseController {

    @Autowired
    private PatientCaseService pcs;

    @Autowired
    private PatientCaseRepository patientCaseRepository;

    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    DiseaseRepository diseaseRe; 

    @Autowired
    SymptomRepository symptomRe;

    @Autowired
    DiseaseSymptomRepository diseaseSymptomRe;

    @PostMapping("/diagnose")
    public ApiResponse<PatientCase> diagnose(@RequestBody DiagnosisRequest dr, @RequestParam String id_doctor) {
        // Gửi dữ liệu cho bác sĩ chuẩn đoán bệnh
        PatientCase patientCase = pcs.sendToDoctorForDiagnosis(dr, id_doctor);

        return ApiResponse.<PatientCase>builder()
                .message("Đã gửi dữ liệu cho bác sĩ chuẩn đoán")
                .data(patientCase)
                .build();
    }

    @PutMapping("/diagnose_disease")
    public ApiResponse<PatientCase> diagnoseDisease(@RequestBody DiagnoseDiseaseRequest pRequest) {
        PatientCase log = patientCaseRepository.findById(pRequest.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy log"));
        log.setSymptoms(pRequest.getSymptoms());
        log.setRiskFactors(pRequest.getRiskFactors());
        log.setPredictedDisease(pRequest.getPredicted_disease());
        log.setStatus("");
        patientCaseRepository.save(log);

        String diseasePrediction = pRequest.getPredicted_disease().trim();
        Disease disease = diseaseRe.findByNameVnIgnoreCase(diseasePrediction).stream().findFirst()
                .orElseGet(() -> diseaseRe.findByNameEnIgnoreCase(diseasePrediction).stream().findFirst().orElse(null));

        if (disease == null) {
            // Tạo mới nếu chưa có
            disease = new Disease();
            disease.setDiseaseId(Disease.generateDiseaseIdLimited20());
            disease.setNameVn(diseasePrediction);
            disease.setNameEn(diseasePrediction); // Nếu không có nameEn
            diseaseRe.save(disease);
        }

        String diseaseId = disease.getDiseaseId();

        // 3. Duyệt từng triệu chứng
        List<String> symptoms = pRequest.getSymptoms();
        for (String symptomText : symptoms) {
            String symptomName = symptomText.trim();

            // Tìm symptom theo name hoặc synonym
            List<Symptom> matched = symptomRe.findByNameOrSynonym(symptomName);
            Symptom symptom = matched.isEmpty() ? null : matched.get(0);

            if (symptom == null) {
                // Nếu chưa có, tạo mới
                symptom = new Symptom();
                symptom.setSymptomId(Symptom.generateSymptomIdLimited20());
                symptom.setNameVn(symptomName);
                symptom.setNameEn(symptomName);
                symptomRe.save(symptom);
            }

            // 4. Tạo liên kết disease - symptom
            DiseaseSymptom ds = new DiseaseSymptom(diseaseId, symptom.getSymptomId(), 0);
            diseaseSymptomRe.save(ds);
        }
        return ApiResponse.<PatientCase>builder()
                .message("Completed update")
                .build();
    }

    @GetMapping("/diagnose/{receiverId}")
    public ApiResponse<List<GetAllDiagnoseDiseaseResponse>> getAllDiagnose(
            @PathVariable("receiverId") String receiverId) {
        List<Notification> notifications = notificationRepository.findByReceiver_Id(receiverId);

        if (notifications.isEmpty()) {
            throw new RuntimeException("Không tìm thấy notification");
        }
        log.info("notification :" + notifications);

        List<GetAllDiagnoseDiseaseResponse> responses = notifications.stream()
                .map(noti -> {
                    PatientCase pcs = patientCaseRepository.findByNotification_Id(noti.getId());
                    if (pcs == null)
                        return null; // Bỏ qua notification không có patientCase
                    return GetAllDiagnoseDiseaseResponse.builder()
                            .id(pcs.getId())
                            .gender(pcs.getGender())
                            .age(pcs.getAge())
                            .location(pcs.getLocation())
                            .symptomStartTime(pcs.getSymptomStartTime())
                            .symptoms(pcs.getSymptoms())
                            .riskFactors(pcs.getRiskFactors())
                            .predictedDisease(pcs.getPredictedDisease())
                            .notificationId(noti.getId())
                            .notificationTitle(noti.getTitle())
                            .notificationContent(noti.getContent())
                            .status(pcs.getStatus())
                            .build();
                })
                .filter(java.util.Objects::nonNull) // Chỉ giữ lại các bản ghi có patientCase
                .collect(Collectors.toList());

        return ApiResponse.<List<GetAllDiagnoseDiseaseResponse>>builder()
                .data(responses)
                .message("Lấy thông tin thành công")
                .build();
    }

}