package com.prediction.backend.services;

import java.util.Optional;

import com.prediction.backend.models.DiagnoseForm;

public interface DiagnoseFormService {
    public DiagnoseForm saveDiagnoseForm(DiagnoseForm diagnoseForm);
    DiagnoseForm updateDiagnoseForm(int id, String predict);
    public Optional<DiagnoseForm> getDiagnoseFormById(int id);
}