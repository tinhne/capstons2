package com.prediction.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a symptom entity in the database.
 * This class maps to the 'symptoms' table and contains information about symptoms,
 * including name, description, frequency, duration, and related metadata.
 */
@Entity
@Table(name = "symptoms")
@Data
public class Symptom {

    /**
     * Unique identifier of the symptom.
     * This field serves as the primary key in the 'symptoms' table.
     */
    @Id
    @Column(name = "symptom_id", length = 20)
    private String symptomId;

    /**
     * Original identifier of the symptom.
     * This field is unique and must not be null.
     */
    @Column(name = "original_id", length = 20, unique = true, nullable = false)
    private String originalId;

    /**
     * English name of the symptom.
     * This field is required and must not be null.
     */
    @Column(name = "name_en", length = 255, nullable = false)
    private String nameEn;

    /**
     * Vietnamese name of the symptom.
     * This field is optional and may be null.
     */
    @Column(name = "name_vn", length = 255)
    private String nameVn;

    /**
     * English description of the symptom.
     * This field provides detailed information about the symptom in English.
     */
    @Column(name = "des_en", columnDefinition = "TEXT")
    private String descriptionEn;

    /**
     * Vietnamese description of the symptom.
     * This field provides detailed information about the symptom in Vietnamese.
     */
    @Column(name = "des_vn", columnDefinition = "TEXT")
    private String descriptionVn;

    /**
     * Synonyms of the symptom.
     * Stored as a TEXT field in the database, representing a list of synonym terms.
     */
    @Column(name = "synonym", columnDefinition = "TEXT")
    private String synonym;

    /**
     * Timestamp when the symptom record was created.
     * This field is automatically set when the record is inserted into the database.
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the symptom record was last updated.
     * This field is automatically updated whenever the record is modified.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Frequency of the symptom occurrence.
     * Possible values are RARE, OCCASIONAL, FREQUENT, or CONSTANT. This field is optional and may be null.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency")
    private Frequency frequency;

    /**
     * Duration of the symptom.
     * This field is optional and may be null, representing how long the symptom typically lasts.
     */
    @Column(name = "duration", length = 255)
    private String duration;

    /**
     * Enumeration representing the frequency levels of a symptom.
     */
    public enum Frequency {
        /**
         * Rare frequency level (seldom occurs).
         */
        RARE,

        /**
         * Occasional frequency level (occurs from time to time).
         */
        OCCASIONAL,

        /**
         * Frequent frequency level (occurs often).
         */
        FREQUENT,

        /**
         * Constant frequency level (occurs continuously).
         */
        CONSTANT
    }
    
    // Getter method
    public String getSymptomId() {
    	return this.symptomId;
    }
}