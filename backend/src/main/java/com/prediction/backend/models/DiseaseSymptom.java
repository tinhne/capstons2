package com.prediction.backend.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

/**
 * Represents the relationship between diseases and symptoms, including the weight of the association.
 */
@Entity
@Table(name = "disease_symptom")
public class DiseaseSymptom {

    /**
     * The composite ID of the DiseaseSymptom entity, embedding diseaseId and symptomId.
     */
    @EmbeddedId
    private DiseaseSymptomId id;

    /**
     * The weight representing the strength of the association between the disease and the symptom.
     */
    @Column(name = "weight")
    private Integer weight;

    /**
     * Default constructor for DiseaseSymptom.
     */
    public DiseaseSymptom() {}

    /**
     * Constructs a new DiseaseSymptom with the specified diseaseId, symptomId, and weight.
     *
     * @param diseaseId The ID of the disease.
     * @param symptomId The ID of the symptom.
     * @param weight The weight of the association.
     */
    public DiseaseSymptom(String diseaseId, String symptomId, Integer weight) {
        this.id = new DiseaseSymptomId(diseaseId, symptomId);
        this.weight = weight;
    }

    /**
     * Gets the composite ID of the DiseaseSymptom.
     *
     * @return The composite ID.
     */
    public DiseaseSymptomId getId() {
        return id;
    }

    /**
     * Sets the composite ID of the DiseaseSymptom.
     *
     * @param id The composite ID to set.
     */
    public void setId(DiseaseSymptomId id) {
        this.id = id;
    }

    /**
     * Gets the weight of the association.
     *
     * @return The weight.
     */
    public Integer getWeight() {
        return weight;
    }

    /**
     * Sets the weight of the association.
     *
     * @param weight The weight to set.
     */
    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    /**
     * Helper method to get the disease ID from the composite ID.
     *
     * @return The disease ID.
     */
    public String getDiseaseId() {
        return id.getDiseaseId();
    }

    /**
     * Helper method to get the symptom ID from the composite ID.
     *
     * @return The symptom ID.
     */
    public String getSymptomId() {
        return id.getSymptomId();
    }
}