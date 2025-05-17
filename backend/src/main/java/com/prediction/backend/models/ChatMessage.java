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
    private String id;

    private String conversationId; // ID của cuộc trò chuyện
    private String senderId; // ID người gửi
    private String content; // Nội dung tin nhắn
    private Instant timestamp; // Thời gian gửi

    // Thông tin phụ
    private String sender; // Loại người gửi: "user", "doctor", "system"
    private boolean isRead; // Đã đọc chưa

}