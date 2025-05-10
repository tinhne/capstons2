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

    public String ask(String userMessage, ConversationDTO conversationDTO, UUID userId) {

        if (conversationDTO.getContents().isEmpty()){
            String prompt = """ 
            Bạn là một trợ lý y tế ảo tận tâm,
            có nhiệm vụ thu thập thông tin bệnh sử của người dùng một cách đầy đủ, 
            chính xác và có hệ thống. Bạn sẽ đặt từng câu hỏi một cách rõ ràng, ngắn gọn và dễ hiểu, 
            sau đó kiên nhẫn chờ người dùng trả lời trước khi tiếp tục với câu hỏi tiếp theo. 
            Mục tiêu là xây dựng một bức tranh toàn diện về tình trạng sức khỏe của người dùng.
            Dữ liệu ban đầu từ người dùng: %s 
            """.formatted(userMessage);
            conversationDTO.addUserMessage(prompt);
        }
        
        conversationDTO.addUserMessage(userMessage);
        Map<String, Object> message = Map.of("contents", conversationDTO.getContents());

        try {
            String response = webClient.post()
                .bodyValue(gson.toJson(message))
                .retrieve()
                .bodyToMono(String.class)
                .block();

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

            Conversation storedConversation = new Conversation(userId, conversationDTO.getContents());
            conversationRepository.save(storedConversation);
            return reply;
        }

        } catch (WebClientResponseException e) {
            // Lỗi từ phía API Gemini trả về (400, 401, 500,...)
            System.err.println("Gemini API Error - Status: " + e.getStatusCode());
            System.err.println("Body: " + e.getResponseBodyAsString());
            return "Error from chatbot system. Please try again.";

        } catch (WebClientRequestException e) {
            // Lỗi không kết nối được tới server (timeout, không mạng,...)
            System.err.println("Can not connected to Gemini API: " + e.getMessage());
            return "Can not connected to system. Please check network or try again.";

        } catch (Exception e) {
            // Các lỗi khác
            System.err.println("Error not defined: " + e.getMessage());
            e.printStackTrace();
            return "Error. Please try again!";
        }
        
        return "Sorry, I can not reply now!";
    }
}
