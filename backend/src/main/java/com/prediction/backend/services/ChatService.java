package com.prediction.backend.services;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.models.Conversation;

import java.util.List;

public interface ChatService {
    public Conversation startConversation(String senderId, String receiverId);

    public ChatMessage sendMessage(ChatMessage message);

    public List<ChatMessage> getChatHistory(String conversationId);

    public List<Conversation> getUserConversations(String userId);
}
