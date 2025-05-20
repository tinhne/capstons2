package com.prediction.backend.controllers;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.BotResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat/bot")
public class ChatBotController {

        @Autowired
        private ChatMessageRepository chatMessageRepository;

        @Autowired
        private ChatService chatService;

        @PostMapping("/message")
        public ApiResponse<BotResponse> chatWithBot(@RequestParam("botId") String botId,
                        @RequestBody ChatMessage userMessage) {
                // 1. Save user message to DB
                userMessage.setTimestamp(Instant.now());
                chatMessageRepository.save(userMessage);

                boolean needDoctor = false;

                // 4. Create bot message
                ChatMessage botMessage = new ChatMessage();
                botMessage.setConversationId(userMessage.getConversationId());
                botMessage.setSenderId(botId);
                botMessage.setContent(chatService.handleData(userMessage.getContent(), userMessage.getConversationId())
                                .block());
                botMessage.setTimestamp(Instant.now());
                botMessage.setSender("bot");

                // 5. Save bot message to DB
                chatMessageRepository.save(botMessage);
                BotResponse botResponse = new BotResponse(botMessage, needDoctor);

                // 6. Return bot message to frontend
                return ApiResponse.<BotResponse>builder()
                                .message("Bot replied successfully")
                                .data(botResponse)
                                .build();
        }

        @PostMapping("/ask")
        public Mono<ResponseEntity<ApiResponse<String>>> ask(
                        @RequestParam("userId") String userId,
                        @RequestParam("message") String message) {

                return chatService.handleData(message, userId)
                                .map(reply -> ResponseEntity.ok(
                                                ApiResponse.<String>builder()
                                                                .message("System Response")
                                                                .data(reply)
                                                                .build()));
        }
}