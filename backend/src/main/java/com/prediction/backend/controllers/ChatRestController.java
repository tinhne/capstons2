package com.prediction.backend.controllers;

import com.prediction.backend.models.Conversation;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.dto.request.AddUserIntoConversationRequest;
import com.prediction.backend.dto.request.RemoveUserRequest;
import com.prediction.backend.dto.request.StartConversationRequest;

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
        Conversation conversation = chatService.startConversation(request.getSenderId(), request.getReceiverId());
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
}

// package com.prediction.backend.controllers;

// import com.prediction.backend.dto.request.StartConversationRequest;
// import com.prediction.backend.dto.response.ApiResponseDto;
// import com.prediction.backend.models.ChatMessage;
// import com.prediction.backend.models.Conversation;
// import com.prediction.backend.services.ChatService;

// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/chat")
// @RequiredArgsConstructor
// public class ChatRestController {

// private final ChatService chatService;
// private final SimpMessagingTemplate messagingTemplate;

// @PostMapping("/start")
// public ResponseEntity<ApiResponseDto<Conversation>>
// startConversation(@RequestBody StartConversationRequest request) {
// Conversation conversation =
// chatService.startConversation(request.getUserId(), request.getDoctorId());
// return ResponseEntity.ok(ApiResponseDto.success(conversation));
// }

// @GetMapping("/{conversationId}/history")
// public ResponseEntity<ApiResponseDto<List<ChatMessage>>>
// getChatHistory(@PathVariable String conversationId) {
// List<ChatMessage> chatHistory = chatService.getChatHistory(conversationId);
// return ResponseEntity.ok(ApiResponseDto.success(chatHistory));
// }

// @GetMapping("/conversations")
// public ResponseEntity<ApiResponseDto<List<Conversation>>>
// getUserConversations(@RequestParam String userId) {
// List<Conversation> conversations = chatService.getUserConversations(userId);
// return ResponseEntity.ok(ApiResponseDto.success(conversations));
// }

// // WebSocket endpoint for handling messages
// @MessageMapping("/chat.send")
// public void sendMessage(@Payload ChatMessage chatMessage) {
// // Save the message in the database
// ChatMessage savedMessage = chatService.sendMessage(chatMessage);

// // Send message to WebSocket subscribers
// messagingTemplate.convertAndSend(
// "/topic/conversations/" + chatMessage.getConversationId(),
// ApiResponseDto.success(savedMessage)
// );
// }
// }
