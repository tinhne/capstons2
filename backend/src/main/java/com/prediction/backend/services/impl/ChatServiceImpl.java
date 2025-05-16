package com.prediction.backend.services.impl;

import com.prediction.backend.dto.ConversationDTO;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Conversation;
import com.prediction.backend.models.Role;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatBotService;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.repositories.ConversationRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final Map<String, List<String>> userCollectedData = new HashMap<>();
    private final Map<String, ConversationDTO> userConversations = new HashMap<>();
    
    private final ChatBotService chatBotService;
    // private final AiModelService aiModelService;

    @Override
    public Conversation startConversation(String senderId, String receiverId) {
        List<String> participants = List.of(senderId, receiverId);

        // Kiểm tra user tồn tại
        userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tạo mới
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setStartTime(Instant.now());
        conversation.setParticipantIds(participants);

        return conversationRepository.save(conversation);
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(message.getConversationId());
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            conversation.setLastMessageTime(Instant.now());
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
    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantIdsContaining(userId);
    }

    @Override
    public Conversation getConversationById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    @Override
    public void addUserToConversation(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        if (!conv.getParticipantIds().contains(userId)) {
            conv.getParticipantIds().add(userId);
            conversationRepository.save(conv);
        }
    }

    @Override
    public boolean checkDoctorInConversation(String conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (conv.getParticipantIds().size() <= 2) {
            return false; // Chỉ có user và bot
        }

        // Lấy danh sách user có role là doctor từ participantIds
        for (String participantId : conv.getParticipantIds()) {
            Optional<User> participant = userRepository.findById(participantId);
            if (participant.isPresent() && participant.get().getRoles() != null) {
                // Kiểm tra xem trong Set<Role> có role nào có name là "DOCTOR" không
                for (Role role : participant.get().getRoles()) {
                    if (role.getName().equalsIgnoreCase("DOCTOR")) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    @Override
    public void removeUserFromConversation(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (conv.getParticipantIds().contains(userId)) {
            conv.getParticipantIds().remove(userId);
            conversationRepository.save(conv);
        } else {
            throw new AppException(ErrorCode.USER_NOT_IN_CONVERSATION);
        }
    }

    @Override
    public Mono<String> handleData(String userMessage, String conversationId) {
        ConversationDTO conversationDTO = userConversations.computeIfAbsent(conversationId, id -> new ConversationDTO());

        return chatBotService.ask(userMessage, conversationDTO, conversationId)
                .flatMap(reply -> {
                    userCollectedData.computeIfAbsent(conversationId, id -> new ArrayList<>()).add("User: " + userMessage);
                    userCollectedData.get(conversationId).add("Bot: " + reply);

                    // Nếu trả về đúng JSON định dạng sức khỏe, gửi đến AIModelService và reset
                    if (ConversationDTO.isValidMedicalJsonFormat(reply)) {
                        // TODO: Gửi JSON đến AIModelService
                        // aiModelService.predictDiagnosis(reply);

                        // Reset cuộc trò chuyện
                        reset(conversationId);

                        // Thêm thông báo rõ ràng nếu cần
                        return Mono.just("day se do aimodel tra ve!");
                    }

                    return Mono.just(reply);
                });
    }

    @Override
    public void reset(String conversationId) {
        userCollectedData.remove(conversationId);
        userConversations.remove(conversationId);
    }
}