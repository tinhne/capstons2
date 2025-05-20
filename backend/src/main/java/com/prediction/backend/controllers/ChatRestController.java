package com.prediction.backend.controllers;

import com.prediction.backend.models.Conversation;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.dto.request.AddUserIntoConversationRequest;
import com.prediction.backend.dto.request.RemoveUserRequest;
import com.prediction.backend.dto.request.StartConversationRequest;
import com.prediction.backend.dto.request.UpdateConversationRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Conversation>> startConversation(@RequestBody StartConversationRequest request) {
        Conversation conversation = chatService.startConversation(request.getSenderId(), request.getReceiverId(),
                request.getFirstMessage());
        return ResponseEntity.ok(ApiResponse.<Conversation>builder()
                .message("Conversation started")
                .data(conversation)
                .build());
    }

    @GetMapping("/{conversationId}/history")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getChatHistory(@PathVariable String conversationId) {
        List<ChatMessage> history = chatService.getChatHistory(conversationId);
        return ResponseEntity.ok(ApiResponse.<List<ChatMessage>>builder()
                .message("Chat history fetched successfully")
                .data(history)
                .build());
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Conversation>>> getConversationsByUserId(@RequestParam String userId) {
        List<Conversation> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(ApiResponse.<List<Conversation>>builder()
                .message("Conversations fetched")
                .data(conversations)
                .build());
    }

    @GetMapping("/conversation/{id}")
    public ApiResponse<Conversation> getConversationById(@PathVariable String id) {
        Conversation conversation = chatService.getConversationById(id);
        return ApiResponse.<Conversation>builder()
                .message("Conversations fetched")
                .data(conversation)
                .build();
    }

    @PostMapping("/conversation/{conversationId}/add-user")
    public ApiResponse<?> addUserToConversation(
            @PathVariable String conversationId,
            @RequestBody AddUserIntoConversationRequest request) {
        chatService.addUserToConversation(conversationId, request.getUserId());
        return ApiResponse.builder()
                .message("Add Successfull")
                .build();
    }

    @GetMapping("/conversation/{conversationId}/check-doctor")
    public ApiResponse<Boolean> checkDoctorInConversation(@PathVariable String conversationId) {
        boolean hasDoctor = chatService.checkDoctorInConversation(conversationId);
        return ApiResponse.<Boolean>builder()
                .status(1000)
                .message("Check successful")
                .data(hasDoctor)
                .build();
    }

    @PostMapping("/conversation/{conversationId}/remove-user")
    public ApiResponse<?> removeUserFromConversation(
            @PathVariable String conversationId,
            @RequestBody RemoveUserRequest request) {
        chatService.removeUserFromConversation(conversationId, request.getUserId());
        return ApiResponse.builder()
                .status(1000)
                .message("User removed successfully")
                .build();
    }

    @DeleteMapping("/conversation/{id}")
    public ResponseEntity<ApiResponse<?>> deleteConversation(@PathVariable String id) {
        chatService.deleteConversation(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Conversation deleted successfully")
                .build());
    }

    @PutMapping("/conversation/{id}")
    public ResponseEntity<ApiResponse<Conversation>> updateConversation(
            @PathVariable String id,
            @RequestBody UpdateConversationRequest request) {
        Conversation updated = chatService.updateConversation(id, request);
        return ResponseEntity.ok(ApiResponse.<Conversation>builder()
                .message("Conversation updated successfully")
                .data(updated)
                .build());
    }
}
