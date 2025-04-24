package com.prediction.backend.services.impl;

import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Conversation;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.repositories.ConversationRepository;

import lombok.RequiredArgsConstructor;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Override
    public Conversation startConversation(String senderId, String receiverId) {
        // Kiểm tra xem conversation đã tồn tại chưa
        Optional<Conversation> existingConversation = conversationRepository
                .findBySenderIdAndReceiverId(senderId, receiverId);

        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }

        // Lấy thông tin người dùng
        userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tạo cuộc trò chuyện mới
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setStartTime(Instant.now());
        conversation.setSenderId(senderId); // Mặc định người bắt đầu là user
        conversation.setReceiverId(receiverId);

        return conversationRepository.save(conversation);
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        // Cập nhật thời gian tin nhắn cuối cùng của cuộc trò chuyện
        Optional<Conversation> conversationOpt = conversationRepository.findById(message.getConversationId());
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            conversation.setLastMessageTime(Instant.now());
            conversation.setSenderId(message.getSenderId());
            conversation.setReceiverId(message.getReceiverId());
            conversationRepository.save(conversation);
        }

        message.setTimestamp(Instant.now());
        message.setRead(false);
        return messageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getChatHistory(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    @Override
    public List<Conversation> getUserConversations(String id) {
        return conversationRepository.findBySenderIdOrReceiverId(id, id);
    }

    @Override
    public Optional<Conversation> getConversationById(String conversationId) {
    return conversationRepository.findById(conversationId);
}
}
