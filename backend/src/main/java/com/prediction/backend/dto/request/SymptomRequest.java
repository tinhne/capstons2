package com.prediction.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for symptom-related requests.
 * Used to encapsulate symptom data for creating or updating symptoms.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomRequest {

    /**
     * Original identifier of the symptom, used as a reference ID.
     */
    @NotBlank(message = "ORIGINAL_ID_REQUIRED")
    private String originalId;

    /**
     * English name of the symptom.
     */
    @NotBlank(message = "NAME_EN_REQUIRED")
    private String nameEn;

    /**
     * Vietnamese name of the symptom.
     */
    @NotBlank(message = "NAME_VN_REQUIRED")
    private String nameVn;

    /**
     * English description of the symptom.
     */
    private String descriptionEn;

    /**
     * Vietnamese description of the symptom.
     */
    private String descriptionVn;

    /**
     * Synonyms of the symptom, separated by commas.
     */
    private String synonym;

    /**
     * Frequency of the symptom occurrence (RARE, OCCASIONAL, FREQUENT, CONSTANT).
     */
    @NotNull(message = "FREQUENCY_REQUIRED")
    private String frequency;

    /**
     * Duration description of the symptom.
     */
    private String duration;
}
