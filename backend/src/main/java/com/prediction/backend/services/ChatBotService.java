
package com.prediction.backend.services;

import com.prediction.backend.dto.ConversationDTO;

import reactor.core.publisher.Mono;

public interface ChatBotService {
    Mono<String> ask(String userMessage, ConversationDTO conversation, String conversationId);
}