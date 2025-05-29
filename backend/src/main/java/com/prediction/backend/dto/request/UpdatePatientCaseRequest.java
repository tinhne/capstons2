package com.prediction.backend.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class UpdatePatientCaseRequest {
    private List<String> symptoms;
    private List<String> riskFactors;
    private String predictedDisease;
}
