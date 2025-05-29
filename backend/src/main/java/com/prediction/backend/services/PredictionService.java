package com.prediction.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import com.prediction.backend.dto.response.PredictionResponse;

import reactor.core.publisher.Mono;

public interface PredictionService {
    Mono<PredictionResponse> predictDisease(String gender, int age, String region, String time, List<String> symptoms, List<String> riskFactors, int top);
}