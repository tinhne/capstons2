package com.prediction.backend.services;

import java.util.Map;

import reactor.core.publisher.Mono;

public interface DataExtractionService {
    Map<String, Object> extractData(Mono<String> conversationData);
}
