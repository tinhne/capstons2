package com.prediction.backend.services;

import java.util.UUID;

import com.prediction.backend.dto.ConversationDTO;

public interface ChatBotService {
    String ask(String userMessage, ConversationDTO conversation, UUID userId);
}
