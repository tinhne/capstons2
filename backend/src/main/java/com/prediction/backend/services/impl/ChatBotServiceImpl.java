package com.prediction.backend.services.impl;

import java.util.Map;

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

@Service
public class ChatBotServiceImpl implements ChatBotService {

    private final WebClient webClient;
    private final Gson gson = new Gson();

    public ChatBotServiceImpl() {
        this.webClient = WebClient.builder()
                .baseUrl(ChatBotConfig.API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

    }

    @Override
    public Mono<String> ask(String userMessage, ConversationDTO conversationDTO, String conversationId) {

        if (conversationDTO.getContents().isEmpty()) {
            String prompt = """
                    You are a friendly virtual medical assistant. Your goal is to collect complete information about the user's health status in the following JSON format:

                    {
                    "metadata": {
                        "age": int,
                        "gender": "Male" | "Female" | "Other",
                        "region": string
                    },
                    "symptoms": [
                        {
                            "name": string,
                            "level": "mild" | "moderate" | "severe"
                        }
                    ]
                    }

                    Please converse naturally, asking questions in a friendly and easy-to-understand manner to collect the necessary information (age, gender, region, symptoms with severity).
                    After collecting some symptoms, confirm with the user if they have any other symptoms. If the user has no more symptoms, end the conversation by sending the exact JSON containing all the collected information,
                    without adding any further explanations or questions.

                    Make sure the conversation is natural, do not list steps, and always maintain a friendly and patient attitude.

                    Start the conversation with the user based on the answer: %s
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

                        // Thử parse reply thành Json để kiểm tra có phải metadata JSON không
                        try {
                            JsonObject replyJson = JsonParser.parseString(reply).getAsJsonObject();

                            // Kiểm tra replyJson có key metadata hoặc symptoms (theo mẫu) để chắc chắn
                            if (replyJson.has("metadata") && replyJson.has("symptoms")) {
                                // Lưu cuộc trò chuyện, có thể lưu dưới dạng JSON string
                                conversationDTO.addChatBotMessage(reply);
                                // conversationRepository.save(new Conversation(userId,
                                // conversationDTO.getContents()));

                                // Trả về JSON thẳng (đã là JSON string)
                                return reply;
                            }
                        } catch (Exception e) {
                            // Nếu parse không phải JSON thì tiếp tục trả về text bình thường
                        }

                        // Nếu không phải JSON, trả về dạng text bình thường
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
                        System.err.println("Can not connect to Gemini API: " + requestEx.getMessage());
                        return Mono.just("Cannot connect to system. Please check network or try again.");
                    }
                    System.err.println("Unexpected error: " + e.getMessage());
                    return Mono.just("Unexpected error occurred.");
                });
    }

}