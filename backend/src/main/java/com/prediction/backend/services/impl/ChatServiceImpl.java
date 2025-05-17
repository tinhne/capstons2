package com.prediction.backend.services.impl;

import com.prediction.backend.config.ChatBotConfig;
import com.prediction.backend.dto.ConversationDTO;
import com.prediction.backend.dto.request.UpdateConversationRequest;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Conversation;
import com.prediction.backend.models.Role;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.UserRepository;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatBotService;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.repositories.ConversationRepository;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final Map<String, List<String>> userCollectedData = new HashMap<>();
    private final Map<String, ConversationDTO> userConversations = new HashMap<>();
    private final WebClient webClient;
    private final Gson gson = new Gson();
    private final ChatBotService chatBotService;

    @Override
    public Conversation startConversation(String senderId, String receiverId, String firstMessage) {
        List<String> participants = List.of(senderId, receiverId);

        // Kiểm tra user tồn tại
        userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String title;
        boolean isDoctor = receiver.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("DOCTOR"));
        boolean isBot = receiver.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("BOT"));

        if (isDoctor) {
            title = "Chat với bác sĩ";
        } else if (isBot && firstMessage != null && !firstMessage.isBlank()) {
            // Lấy nội dung chính: câu đầu tiên hoặc 10 từ đầu
            String[] sentences = firstMessage.split("[.!?]");
            String main = sentences[0].trim();
            String[] words = main.split("\\s+");
            title = String.join(" ", java.util.Arrays.copyOfRange(words, 0, Math.min(10, words.length)));
            if (words.length > 10)
                title += "...";
        } else {
            title = "New Chat";
        }
        // Tạo mới
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setTitle(title);
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
    public Mono<String> handleData(String userMessage, String userId) {
        ConversationDTO conversationDTO = userConversations.computeIfAbsent(userId, id -> new ConversationDTO());

        return chatBotService.ask(userMessage, conversationDTO, userId)
                .flatMap(reply -> {
                    userCollectedData.computeIfAbsent(userId, id -> new ArrayList<>()).add("User: " + userMessage);
                    userCollectedData.get(userId).add("Bot: " + reply);

                    // Nếu trả về đúng JSON định dạng sức khỏe, gửi đến AIModelService và reset
                    if (ConversationDTO.isValidMedicalJsonFormat(reply)) {
                        // TODO: Gửi JSON đến AIModelService
                        // aiModelService.predictDiagnosis(reply);

                        // Reset cuộc trò chuyện
                        reset(userId);

                        // Thêm thông báo rõ ràng nếu cần
                        return Mono.just("day se do aimodel tra ve!");
                    }

                    return Mono.just(reply);
                });
    }

    @Override
    public void reset(String userId) {
        userCollectedData.remove(userId);
        userConversations.remove(userId);
    }

    @Override
    public void deleteConversation(String conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        // Xoá tất cả message thuộc conversation này (nếu cần)
        messageRepository.deleteAll(messageRepository.findByConversationIdOrderByTimestampAsc(conversationId));
        conversationRepository.delete(conv);
    }

    @Override
    public Conversation updateConversation(String conversationId, UpdateConversationRequest request) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        if (request.getTitle() != null) {
            conv.setTitle(request.getTitle());
        }
        // Thêm cập nhật các trường khác nếu cần
        return conversationRepository.save(conv);
    }
}