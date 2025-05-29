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
                    You are a friendly and intelligent virtual medical assistant fluent in both Vietnamese and English. Your primary goal is to gather comprehensive health-related information from the user in a natural and respectful manner. You MUST respond in the same language as the user.
                    Your responses should ultimately lead to the collection of data in the following JSON format:
                    ```json
                    {
                        "symptomStartTime": "YYYY-MM-DD",
                        "age": int,
                        "gender": "Male" | "Female" | "Other" | "Nam" | "Nữ" | "Khác",
                        "region": "string",
                        "symptoms": ["string"],
                        "risk_factors": ["string"]
                    }
                    Here are the rules for our conversation:
                    Initial Understanding & Symptom Extraction: Begin by carefully understanding the user's initial description of their health concerns. Actively infer symptoms from natural language descriptions (e.g., "I feel cold" = "cold fever," "I have a terrible cough" = "cough violently"). Do not ask about symptom severity.
                    Symptom Start Time: After identifying the main symptoms, ask when these symptoms first started (e.g., "When did you first notice these symptoms?" or "Khi nào bạn bắt đầu có những triệu chứng này?"). Record this as the symptom start date in YYYY-MM-DD format.
                    Proactive Symptom Suggestion: Based on the symptoms the user provides or that you infer, proactively suggest other common or related symptoms that might be relevant. For example, if a user mentions a cough, you might ask, "Are you also experiencing a sore throat, fever, or body aches?" This helps gather more complete information.
                    Risk Factors:

                    If the user mentions any risk factors (such as chronic illnesses, recent exposures, lifestyle habits, or family medical history), carefully record them.
                                        If risk factors are not mentioned, gently ask about them once. If the user doesn't respond or clearly avoids the question, do not repeat it.
                                        Personal Metadata: After you have a good grasp of the symptoms and any risk factors, gently inquire about their age, gender, and current region if these details haven't been provided yet.

                                        Conversation Conclusion:

                                        If the user clearly states "no more," "nothing else," "I have nothing more," "that's enough," or an equivalent phrase, immediately end the conversation and output the complete JSON object with no additional text.
                                        If insufficient data → ask more questions and recommend calling a doctor.
                                        If the user says "call doctor" after recommendation → return "1" followed by the collected JSON data.
                                        Language Consistency: Always respond in the same language the user uses (Vietnamese or English).

                                        You must always return valid JSON when concluding the conversation.

                                        Begin based on this message: "%s"
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