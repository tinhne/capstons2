package com.prediction.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;

import java.text.SimpleDateFormat;
//import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

/**
 * Represents a disease entity in the database.
 * This class maps to the 'diseases' table and contains information about diseases,
 * including name, description, severity level, and related metadata.
 */
@Entity
@Table(name = "diseases")
@Data
public class Disease {

    /**
     * Unique identifier of the disease.
     * This field serves as the primary key in the 'diseases' table.
     */
    @Id
    @Column(name = "disease_id", length = 20)
    private String diseaseId;

    /**
     * Original identifier of the disease.
     * This field is unique and must not be null.
     */
    @Column(name = "original_id", length = 20, unique = true, nullable = false)
    private String originalId;

    /**
     * English name of the disease.
     * This field is required and must not be null.
     */
    @Column(name = "name_en", length = 255, nullable = false)
    private String nameEn;

    /**
     * Vietnamese name of the disease.
     * This field is optional and may be null.
     */
    @Column(name = "name_vn", length = 255)
    private String nameVn;

    /**
     * English description of the disease.
     * This field provides detailed information about the disease in English.
     */
    @Column(name = "des_en", columnDefinition = "TEXT")
    private String descriptionEn;

    /**
     * Vietnamese description of the disease.
     * This field provides detailed information about the disease in Vietnamese.
     */
    @Column(name = "des_vn", columnDefinition = "TEXT")
    private String descriptionVn;

    /**
     * Severity level of the disease.
     * Possible values are LOW, MEDIUM, or HIGH. This field is optional and may be null.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity;

    /**
     * Medical specialization associated with the disease.
     * This field is optional and may be null.
     */
    @Column(name = "specialization", length = 255)
    private String specialization;

    /**
     * List of synonyms for the disease.
     * Stored as a JSON array in the database.
     */
    @Convert(converter = SynonymsConverter.class)
    @Column(name = "synonyms", columnDefinition = "json")
    private List<String> synonyms;

    /**
     * Enumeration representing the severity levels of a disease.
     */
    public enum Severity {
        /**
         * Low severity level.
         */
        LOW,
        
        /**
         * Medium severity level.
         */
        MEDIUM,
        
        /**
         * High severity level.
         */
        HIGH
    }

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    public static String generateDiseaseIdLimited20() {
    SimpleDateFormat formatter = new SimpleDateFormat("yyMMddHHmmssSS");
    String timestamp = formatter.format(new Date());
    String random2Digits = String.format("%02d", (int)(Math.random() * 100));
    return "DIS-" + timestamp + random2Digits; // đúng 20 ký tự
}

}