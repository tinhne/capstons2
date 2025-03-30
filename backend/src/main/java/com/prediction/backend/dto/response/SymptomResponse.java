package com.prediction.backend.dto.response;

import com.prediction.backend.models.Symptom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for symptom-related responses.
 * Used to provide structured symptom data in API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomResponse {

    /**
     * Unique identifier of the symptom.
     */
    private String symptomId;

    /**
     * Original identifier of the symptom.
     */
    private String originalId;

    /**
     * English name of the symptom.
     */
    private String nameEn;

    /**
     * Vietnamese name of the symptom.
     */
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
     * Synonyms of the symptom.
     */
    private String synonym;

    /**
     * Frequency of the symptom occurrence (RARE, OCCASIONAL, FREQUENT, CONSTANT).
     */
    private String frequency;

    /**
     * Duration description of the symptom.
     */
    private String duration;

    /**
     * Timestamp when the symptom record was created.
     */
    private LocalDateTime createdAt;

    /**
     * Timestamp when the symptom record was last updated.
     */
    private LocalDateTime updatedAt;

    /**
     * Converts a Symptom entity to a SymptomResponse DTO.
     *
     * @param symptom the Symptom entity to convert
     * @return a SymptomResponse DTO with data from the Symptom entity
     */
    public static SymptomResponse fromEntity(Symptom symptom) {
        return SymptomResponse.builder()
                .symptomId(symptom.getSymptomId())
                .originalId(symptom.getOriginalId())
                .nameEn(symptom.getNameEn())
                .nameVn(symptom.getNameVn())
                .descriptionEn(symptom.getDescriptionEn())
                .descriptionVn(symptom.getDescriptionVn())
                .synonym(symptom.getSynonym())
                .frequency(symptom.getFrequency() != null ? symptom.getFrequency().name() : null)
                .duration(symptom.getDuration())
                .createdAt(symptom.getCreatedAt())
                .updatedAt(symptom.getUpdatedAt())
                .build();
    }
}