package com.prediction.backend.dto;

import lombok.Data;

@Data
public class DiseasePrediction {
    private String disease;
    private double probability_percentage;

    @Override
    public String toString() {
        return disease + " (" + String.format("%.2f", probability_percentage) + "%)";
    }
}
