package com.prediction.backend.services.impl;

import com.prediction.backend.dto.response.PredictionResponse;
import com.prediction.backend.services.PredictionService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService {

    private static final String API_URL = "http://127.0.0.1:8000";
    private final WebClient webClient;

    public PredictionServiceImpl() {
        this.webClient = WebClient.builder()
                .baseUrl(API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public Mono<PredictionResponse> predictDisease(
        String gender,
        int age,
        String region,
        String time,
        List<String> symptoms,
        List<String> riskFactors,
        int topK) {

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("gioi_tinh", gender);
        requestBody.put("do_tuoi", age);
        requestBody.put("dia_diem", region);
        requestBody.put("thoi_gian", time);
        requestBody.put("trieu_chung", symptoms);
        requestBody.put("yeu_to_nguy_co", riskFactors);
        requestBody.put("top_k", topK);

        return webClient.post()
                .uri("/predict")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(PredictionResponse.class)
                .onErrorResume(e -> {
                    System.err.println("Error calling prediction API: " + e.getMessage());
                    return Mono.error(new RuntimeException("Prediction service failed", e));
                });
    }
}
