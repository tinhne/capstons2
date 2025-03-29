package com.prediction.backend.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.Objects;

/**
 * Represents the composite primary key for the DiseaseSymptom entity.
 * This class is embedded into the DiseaseSymptom entity.
 */
@Embeddable
public class DiseaseSymptomId implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * The ID of the disease associated with the symptom.
     */
    @Column(name = "disease_id", length = 20)
    private String diseaseId;

    /**
     * The ID of the symptom associated with the disease.
     */
    @Column(name = "symptom_id", length = 20)
    private String symptomId;

    /**
     * Default constructor for DiseaseSymptomId.
     */
    public DiseaseSymptomId() {}

    /**
     * Constructs a new DiseaseSymptomId with the specified diseaseId and symptomId.
     *
     * @param diseaseId The ID of the disease.
     * @param symptomId The ID of the symptom.
     */
    public DiseaseSymptomId(String diseaseId, String symptomId) {
        this.diseaseId = diseaseId;
        this.symptomId = symptomId;
    }

    /**
     * Gets the disease ID.
     *
     * @return The disease ID.
     */
    public String getDiseaseId() {
        return diseaseId;
    }

    /**
     * Sets the disease ID.
     *
     * @param diseaseId The disease ID to set.
     */
    public void setDiseaseId(String diseaseId) {
        this.diseaseId = diseaseId;
    }

    /**
     * Gets the symptom ID.
     *
     * @return The symptom ID.
     */
    public String getSymptomId() {
        return symptomId;
    }

    /**
     * Sets the symptom ID.
     *
     * @param symptomId The symptom ID to set.
     */
    public void setSymptomId(String symptomId) {
        this.symptomId = symptomId;
    }

    /**
     * Checks if this DiseaseSymptomId is equal to another object.
     *
     * @param o The object to compare with.
     * @return true if the objects are equal, false otherwise.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DiseaseSymptomId that = (DiseaseSymptomId) o;
        return Objects.equals(diseaseId, that.diseaseId) &&
               Objects.equals(symptomId, that.symptomId);
    }

    /**
     * Generates a hash code for this DiseaseSymptomId.
     *
     * @return The hash code.
     */
    @Override
    public int hashCode() {
        return Objects.hash(diseaseId, symptomId);
    }
}