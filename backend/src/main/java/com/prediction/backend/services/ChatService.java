package com.prediction.backend.services;

import com.prediction.backend.dto.request.UpdateConversationRequest;
import com.prediction.backend.dto.response.BotResponseDetail;
import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.models.Conversation;

import reactor.core.publisher.Mono;

import java.util.List;

public interface ChatService {
    /**
     * Start a new conversation between user and doctor
     * 
     * @param senderId   ID of the sender
     * @param receiverId ID of the receiver
     * @return the created or existing conversation
     */
    Conversation startConversation(String senderId, String receiverId, String firstMessage);

    /**
     * Send a message in a conversation
     * 
     * @param message the message to send
     * @return the saved message with ID
     */
    ChatMessage sendMessage(ChatMessage message);

    /**
     * Get chat history for a conversation
     * 
     * @param conversationId ID of the conversation
     * @return list of messages sorted by timestamp
     */
    List<ChatMessage> getChatHistory(String conversationId);

    /**
     * Get all conversations for a user
     * 
     * @param userId ID of the user
     * @return list of conversations
     */
    List<Conversation> getUserConversations(String userId);

    Conversation getConversationById(String conversationId);

    void addUserToConversation(String conversationId, String userId);

    boolean checkDoctorInConversation(String conversationId);

    void removeUserFromConversation(String conversationId, String userId);

    BotResponseDetail handleData(String userMessage, String conversationId, int age, String gender,
            String underlying_disease);

    void reset(String conversationId);

    void deleteConversation(String conversationId);

    Conversation updateConversation(String conversationId, UpdateConversationRequest request);
}
