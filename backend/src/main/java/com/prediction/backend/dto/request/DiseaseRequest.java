package com.prediction.backend.dto.request;

import com.prediction.backend.models.Disease;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseRequest {

    @NotBlank(message = "ORIGINAL_ID_REQUIRED")
    private String originalId;

    @NotBlank(message = "NAME_EN_REQUIRED")
    private String nameEn;

    private String nameVn;

    private String descriptionEn;

    private String descriptionVn;

    @NotNull(message = "SEVERITY_REQUIRED")
    private Disease.Severity severity;

    private String specialization;
}