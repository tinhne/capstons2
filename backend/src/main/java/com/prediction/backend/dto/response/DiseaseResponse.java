package com.prediction.backend.dto.response;

import com.prediction.backend.models.Disease;
import com.prediction.backend.models.Symptom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseResponse {
    private String diseaseId;
    private String originalId;
    private String nameEn;
    private String nameVn;
    private String descriptionEn;
    private String descriptionVn;
    private Disease.Severity severity;
    private String specialization;
    private List<Symptom> symptoms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Tạo một DiseaseResponse từ entity Disease
     */
    public static DiseaseResponse fromEntity(Disease disease) {
        return DiseaseResponse.builder()
                .diseaseId(disease.getDiseaseId())
                .originalId(disease.getOriginalId())
                .nameEn(disease.getNameEn())
                .nameVn(disease.getNameVn())
                .descriptionEn(disease.getDescriptionEn())
                .descriptionVn(disease.getDescriptionVn())
                .severity(disease.getSeverity())
                .specialization(disease.getSpecialization())
                .build();
    }

    /**
     * Tạo một DiseaseResponse từ entity Disease và danh sách triệu chứng
     */
    public static DiseaseResponse fromEntityWithSymptoms(Disease disease, List<Symptom> symptoms) {
        DiseaseResponse response = fromEntity(disease);
        response.setSymptoms(symptoms);
        return response;
    }
}