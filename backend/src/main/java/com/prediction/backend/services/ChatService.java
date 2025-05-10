package com.prediction.backend.services;

import java.util.UUID;

public interface ChatService {
    String handleData(String userMessage, UUID userId);
    String getHistoryData(UUID userId);
    void reset(UUID userId);
}
