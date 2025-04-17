package com.prediction.backend.controllers;

import com.prediction.backend.models.Conversation;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.dto.request.StartConversationRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Conversation>> startConversation(@RequestBody StartConversationRequest request) {
        Conversation conversation = chatService.startConversation(request.getDoctorId(), request.getUserId());
        return ResponseEntity.ok(ApiResponse.<Conversation>builder()
                .status(1000)
                .message("Conversation started")
                .data(conversation)
                .build());
    }

    @GetMapping("/{conversationId}/history")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getChatHistory(@PathVariable String conversationId) {
        List<ChatMessage> history = chatService.getChatHistory(conversationId);
        return ResponseEntity.ok(ApiResponse.<List<ChatMessage>>builder()
                .status(1000)
                .message("Chat history fetched successfully")
                .data(history)
                .build());
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Conversation>>> getConversationsByUserId(@RequestParam String userId) {
        List<Conversation> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(ApiResponse.<List<Conversation>>builder()
                .status(1000)
                .message("Conversations fetched")
                .data(conversations)
                .build());
    }
}
