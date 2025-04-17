package com.prediction.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    private String messageId;

    private String conversationId;
    private String senderId;
    private String senderRole; // "ADMIN" or "USER"
    private String content;
    private Instant timestamp;
}