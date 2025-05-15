package com.prediction.backend.services.impl;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import com.prediction.backend.services.ChatBotService;

import reactor.core.publisher.Mono;

import com.prediction.backend.config.ChatBotConfig;
import com.prediction.backend.dto.ConversationDTO;
import com.prediction.backend.models.Conversation;
import com.prediction.backend.repositories.ConversationRepository;

@Service
public class ChatBotServiceImpl implements ChatBotService {

    private final WebClient webClient;
    private final Gson gson = new Gson();
    private final ConversationRepository conversationRepository;

    public ChatBotServiceImpl(ConversationRepository conRe) {
        this.conversationRepository = conRe;
        this.webClient = WebClient.builder()
                .baseUrl(ChatBotConfig.API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

    }

    @Override
    public Mono<String> ask(String userMessage, ConversationDTO conversationDTO, UUID userId) {

        if (conversationDTO.getContents().isEmpty()) {
            String prompt = """
                    Hãy giúp tôi thu thập thông tin sức khỏe người dùng dưới dạng JSON với các trường:
                    meta_data: { age:int, gender: enum (Male, Female, Other), region: string }
                    symptoms: set<symptom>; symptom: { name:string, level: enum (nhẹ, trung bình, nặng) }
                    Hãy hỏi từng trường một cách rõ ràng, sau mỗi câu trả lời hãy xác nhận lại và hỏi tiếp trường còn thiếu.: %s
                                        """
                    .formatted(userMessage);
            conversationDTO.addUserMessage(prompt);
        }

        conversationDTO.addUserMessage(userMessage);
        Map<String, Object> message = Map.of("contents", conversationDTO.getContents());

        return webClient.post()
                .bodyValue(gson.toJson(message))
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    JsonObject json = JsonParser.parseString(response).getAsJsonObject();
                    JsonArray candidates = json.getAsJsonArray("candidates");
                    if (candidates != null && candidates.size() > 0) {
                        String reply = candidates.get(0)
                                .getAsJsonObject()
                                .getAsJsonObject("content")
                                .getAsJsonArray("parts")
                                .get(0)
                                .getAsJsonObject()
                                .get("text").getAsString();

                        conversationDTO.addChatBotMessage(reply);
                        // conversationRepository.save(new Conversation(userId,
                        // conversationDTO.getContents()));
                        return reply;
                    }
                    return "Sorry, no reply from chatbot.";
                })
                .onErrorResume(e -> {
                    if (e instanceof WebClientResponseException responseEx) {
                        System.err.println("Gemini API Error - Status: " + responseEx.getStatusCode());
                        System.err.println("Body: " + responseEx.getResponseBodyAsString());
                        return Mono.just("Error from chatbot system. Please try again.");
                    } else if (e instanceof WebClientRequestException requestEx) {
                        System.err.println("Can not connected to Gemini API: " + requestEx.getMessage());
                        return Mono.just("Cannot connect to system. Please check network or try again.");
                    }
                    System.err.println("Unexpected error: " + e.getMessage());
                    return Mono.just("Unexpected error occurred.");
                });
    }

}