package com.prediction.backend.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.services.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Gửi một câu hỏi và nhận phản hồi từ chatbot
    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<String>> ask(
            @RequestParam("userId") UUID userId,
            @RequestParam("message") String message) {
        String reply = chatService.handleData(message, userId);
        return ResponseEntity.ok(
            ApiResponse.<String>builder()
            .message("System Response")
            .data(reply)
            .build());
    }

    // Lấy lịch sử hội thoại của một người dùng
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<String>> getHistory(
            @RequestParam("userId") UUID userId) {
        String history = chatService.getHistoryData(userId);
        return ResponseEntity.ok(
            ApiResponse.<String>builder()
            .message("Conversation History")
            .data(history)
            .build()
        );
    }

    // Reset cuộc hội thoại và dữ liệu của người dùng
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<String>> resetConversation(
            @RequestParam("userId") UUID userId) {
        chatService.reset(userId);
        return ResponseEntity.ok(
            ApiResponse.<String>builder()
                .message("Conversation reset successful")
                .data("Conversation has been reset for user " + userId)
                .build()
        );
    }
}
