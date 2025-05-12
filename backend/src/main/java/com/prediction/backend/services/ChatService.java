package com.prediction.backend.services;

import java.util.UUID;

import reactor.core.publisher.Mono;

public interface ChatService {
    Mono<String> handleData(String userMessage, UUID userId);
    Mono<String> getHistoryData(UUID userId);
    void reset(UUID userId);
}
