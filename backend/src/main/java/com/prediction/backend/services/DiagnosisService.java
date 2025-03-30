package com.prediction.backend.services;

import com.prediction.backend.dto.request.DiagnosisRequest;
import com.prediction.backend.dto.response.DiagnosisResponse;
import com.prediction.backend.exceptions.AppException;

public interface DiagnosisService {
     /**
      * Diagnoses diseases based on the provided list of symptoms name.
      *
      * @param symptoms A list of symptom name.
      * @return A Diagnosis object containing the diagnosis result.
      */
     DiagnosisResponse diagnose(DiagnosisRequest diagnosisRequest) throws AppException;
}