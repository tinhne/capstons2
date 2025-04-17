package com.prediction.backend.services.impl;

import com.prediction.backend.models.Conversation;

import org.springframework.stereotype.Service;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.repositories.ConversationRepository;

import lombok.RequiredArgsConstructor;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public Conversation startConversation(String senderId, String receiverId) {
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setSenderId(senderId);
        conversation.setReceiverId(receiverId);
        conversation.setStartTime(Instant.now());
        return conversationRepository.save(conversation);
    }

    public ChatMessage sendMessage(ChatMessage message) {
        message.setMessageId(UUID.randomUUID().toString());
        message.setTimestamp(Instant.now());
        return messageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findBySenderIdOrReceiverId(userId, userId);
    }
}
