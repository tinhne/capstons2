package com.prediction.backend.config;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    // Track connected users by session ID
    private final Map<String, String> sessionUsers = new HashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String userId = headerAccessor.getFirstNativeHeader("userId");

        if (userId != null && sessionId != null) {
            // Store the session-user mapping
            sessionUsers.put(sessionId, userId);
            log.info("User connected: userId={}, sessionId={}", userId, sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        if (sessionId != null && sessionUsers.containsKey(sessionId)) {
            String userId = sessionUsers.get(sessionId);

            // Notify others that user has gone offline
            log.info("User disconnected: userId={}, sessionId={}", userId, sessionId);

            // Remove the user from the map
            sessionUsers.remove(sessionId);
        }
    }

    // Helper method to send system messages to a conversation
    public void sendSystemMessage(String conversationId, String content, String recipientId) {
        ChatMessage message = new ChatMessage();
        message.setId(UUID.randomUUID().toString());
        message.setConversationId(conversationId);
        message.setSender("system");
        message.setContent(content);
        message.setSenderId("system");
        message.setReceiverId(recipientId);
        message.setTimestamp(Instant.now());
        message.setRead(false);

        // Save to database
        ChatMessage savedMessage = chatService.sendMessage(message);

        // Send via WebSocket
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                ApiResponse.success(savedMessage));
    }
}