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
                    Bạn là trợ lý y tế ảo thân thiện, mục tiêu là thu thập đầy đủ thông tin về tình trạng sức khỏe của người dùng theo định dạng JSON như sau:

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

                    Bạn hãy trò chuyện tự nhiên, đặt các câu hỏi một cách thân thiện
                    và dễ hiểu để thu thập các thông tin cần thiết (tuổi, giới tính, khu vực, triệu chứng với mức độ).
                    Sau khi thu thập một số triệu chứng thì hãy xác nhân nguời dùng còn
                    triệu chứng nào khác không, nếu người dùng không còn triệu chứng nào
                    khác nữa thì bạn mới kết thúc cuộc trò chuyện bằng cách gửi chính xác JSON chứa tất cả thông tin đã thu thập,
                    không thêm bất kỳ lời giải thích hay câu hỏi nào khác.

                    Hãy đảm bảo cuộc trò chuyện diễn ra tự nhiên, không liệt kê các bước, và luôn giữ thái độ thân thiện, kiên nhẫn.

                    Bắt đầu trò chuyện với người dùng dựa trên câu trả lời: %s
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