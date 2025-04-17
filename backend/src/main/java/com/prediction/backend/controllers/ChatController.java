package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

   @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = chatService.sendMessage(chatMessage);

        ApiResponse<ChatMessage> response = ApiResponse.<ChatMessage>builder()
                .status(1000)
                .message("New message")
                .data(savedMessage)
                .build();

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + chatMessage.getConversationId(),
                response
        );
    }
}