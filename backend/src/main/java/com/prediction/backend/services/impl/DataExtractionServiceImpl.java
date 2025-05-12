package com.prediction.backend.services.impl;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.google.gson.Gson;
import com.prediction.backend.services.DataExtractionService;

import reactor.core.publisher.Mono;

import com.prediction.backend.config.ChatBotConfig;

@Service
public class DataExtractionServiceImpl implements DataExtractionService {
    
    private final WebClient webClient;
    private final Gson gson = new Gson();
    
    public DataExtractionServiceImpl() {
        this.webClient = WebClient.builder()
        .baseUrl(ChatBotConfig.API_URL)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
    }
    @Override
    public Map<String, Object> extractData(Mono<String> conversationData) {
        String prompt = "";
        return null;
    }
    
}
