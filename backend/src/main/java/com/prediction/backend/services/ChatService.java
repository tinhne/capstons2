package com.prediction.backend.services;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.models.Conversation;

import java.util.List;
import java.util.Optional;

public interface ChatService {
    /**
     * Start a new conversation between user and doctor
     * 
     * @param userId   ID of the user
     * @param doctorId ID of the doctor
     * @return the created or existing conversation
     */
    Conversation startConversation(String userId, String doctorId);

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

    Optional<Conversation> getConversationById(String conversationId);
}
