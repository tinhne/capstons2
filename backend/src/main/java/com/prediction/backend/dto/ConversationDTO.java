package com.prediction.backend.dto;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class ConversationDTO {
    private List<Map<String, Object>> contents = new ArrayList<>();

    public List<Map<String, Object>> getContents() {
        return contents;
    }

    // public void addSystemMessage(String text){
    // contents.add(Map.of(
    // "role", "system",
    // "parts", List.of(Map.of("text", text))
    // ));
    // }

    public void addUserMessage(String text) {
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", text))));
    }

    public void addChatBotMessage(String text) {
        contents.add(Map.of(
                "role", "model",
                "parts", List.of(Map.of("text", text))));
    }
}