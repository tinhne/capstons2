package com.prediction.backend.controllers;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.dto.request.UserDetailRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.BotResponse;
import com.prediction.backend.dto.response.BotResponseDetail;

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
                        @RequestBody UserDetailRequest userDetailRequest) {
                // 1. Save user message to DB

                ChatMessage userMessage = userDetailRequest.getUserMessage();
                userMessage.setTimestamp(Instant.now());
                chatMessageRepository.save(userMessage);

                BotResponseDetail responseDetail = chatService.handleData(userMessage.getContent(),
                                userMessage.getConversationId(), userDetailRequest.getAge(), userDetailRequest.getGender(), userDetailRequest.getUnderlying_disease());
                // 4. Create bot message
                ChatMessage botMessage = new ChatMessage();
                botMessage.setConversationId(userMessage.getConversationId());
                botMessage.setSenderId(botId);
                botMessage.setContent(responseDetail.getData());
                botMessage.setTimestamp(Instant.now());
                botMessage.setSender("bot");

                // 5. Save bot message to DB
                chatMessageRepository.save(botMessage);
                BotResponse botResponse = new BotResponse(botMessage, responseDetail.isNeededDoctor(),
                                responseDetail.getLog());

                // 6. Return bot message to frontend
                return ApiResponse.<BotResponse>builder()
                                .message("Bot replied successfully")
                                .data(botResponse)
                                .build();
        }
}