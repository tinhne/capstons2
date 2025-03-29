package com.prediction.backend.services;

import com.prediction.backend.models.Disease;

import java.util.List;

public interface DiagnosisService {
	/**
     * Diagnoses diseases based on the provided list of symptoms name.
     *
     * @param symptoms A list of symptom name.
     * @return A Diagnosis object containing the diagnosis result.
     */
	List<Disease> diagnose(List<String> symptomNames);
}