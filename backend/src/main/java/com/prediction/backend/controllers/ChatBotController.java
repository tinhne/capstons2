package com.prediction.backend.controllers;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.services.DiseaseService;
import com.prediction.backend.models.Disease;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.BotResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/chat/bot")
public class ChatBotController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private DiseaseService diseaseService;

    @PostMapping("/message")
    public ApiResponse<BotResponse> chatWithBot(@RequestBody ChatMessage userMessage) {
        // 1. Lưu tin nhắn user vào DB
        userMessage.setTimestamp(Instant.now());
        chatMessageRepository.save(userMessage);

        // 2. Gọi API search bệnh
        List<Disease> diseases = diseaseService.searchDiseases(userMessage.getContent());

        // 3. Tạo nội dung trả lời của bot
        // 3. Tạo nội dung trả lời của bot
        List<String> diseaseNames = diseases.stream()
                .map(d -> {
                    String vn = d.getNameVn() != null ? d.getNameVn() : "";
                    String en = d.getNameEn() != null ? d.getNameEn() : "";
                    if (!vn.isEmpty() && !en.isEmpty()) {
                        return vn + " (" + en + ")";
                    } else if (!vn.isEmpty()) {
                        return vn;
                    } else {
                        return en;
                    }
                })
                .filter(name -> !name.isEmpty())
                .toList();

        String botContent;
        boolean needDoctor = false;

        if (diseaseNames.isEmpty()) {
            botContent = "Không tìm thấy bệnh phù hợp với từ khóa: " + userMessage.getContent()
                    + ". Bạn có muốn kết nối với bác sĩ để được tư vấn trực tiếp không?";
            needDoctor = true;
        } else {
            botContent = "Các bệnh phù hợp: " + String.join(", ", diseaseNames);
        }

        // 4. Tạo tin nhắn bot
        ChatMessage botMessage = new ChatMessage();
        botMessage.setConversationId(userMessage.getConversationId());
        botMessage.setSenderId("bot");
        botMessage.setReceiverId(userMessage.getSenderId());
        botMessage.setContent(botContent);
        botMessage.setTimestamp(Instant.now());
        botMessage.setSender("bot");

        // 5. Lưu tin nhắn bot vào DB
        chatMessageRepository.save(botMessage);
        BotResponse botResponse = new BotResponse(botMessage, needDoctor);

        // 6. Trả về tin nhắn bot cho frontend
        return ApiResponse.<BotResponse>builder()
                .status(1000)
                .message("Bot trả lời thành công")
                .data(botResponse)
                .build();
    }
}