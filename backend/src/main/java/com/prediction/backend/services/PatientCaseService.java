package com.prediction.backend.services;

import com.prediction.backend.dto.request.DiagnosisRequest;
import com.prediction.backend.models.PatientCase;

public interface PatientCaseService {
    public PatientCase sendToDoctorForDiagnosis(DiagnosisRequest dr, String id_doctor);
}
