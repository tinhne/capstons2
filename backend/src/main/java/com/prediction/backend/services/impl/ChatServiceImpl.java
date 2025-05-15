package com.prediction.backend.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.prediction.backend.dto.ConversationDTO;
import com.prediction.backend.services.ChatService;

import reactor.core.publisher.Mono;

import com.prediction.backend.services.ChatBotService;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatBotService chatBotService;
    // private final AIModelService aiModelService;
    private final Map<UUID, List<String>> userCollectedData = new HashMap<>();
    private final Map<UUID, ConversationDTO> userConversations = new HashMap<>();

    public ChatServiceImpl(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    // @Override
    // public Mono<String> handleData(String userMessage, UUID userId) {
    //     ConversationDTO conversationDTO = userConversations.computeIfAbsent(userId, id -> new ConversationDTO());
    //     return chatBotService.ask(userMessage, conversationDTO, userId)
    //         .map(reply -> {
    //             userCollectedData.computeIfAbsent(userId, id -> new ArrayList<>()).add("User: " + userMessage);
    //             userCollectedData.get(userId).add("Bot: " + reply);
    //             return reply;
    //         });
    // }
    @Override
    public Mono<String> handleData(String userMessage, UUID userId) {
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
    public Mono<String> getHistoryData(UUID userId) {
        List<String> history = userCollectedData.getOrDefault(userId, new ArrayList<>());
        return Mono.just(String.join("\n", history));
    }

    @Override
    public void reset(UUID userId) {
        userCollectedData.remove(userId);
        userConversations.remove(userId); 
    }
}
