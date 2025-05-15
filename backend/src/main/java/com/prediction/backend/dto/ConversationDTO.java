package com.prediction.backend.dto;

import java.util.List;
import java.util.Map;

import com.google.gson.JsonObject;

import java.util.ArrayList;

public class ConversationDTO {
    private List<Map<String, Object>> contents = new ArrayList<>();

    public List<Map<String, Object>> getContents() {
        return contents;
    }
    public Map<String, Object> getLastContent() {
        if (contents != null && !contents.isEmpty()) {
            return contents.get(contents.size()-1);
        }
        return null;
    }
    public void showLastResult() {
        if (contents != null && !contents.isEmpty())
            System.out.print(contents.get(contents.size() -1 ));
    }
    public void addUserMessage(String text) {
        contents.add(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", text))
        ));
    }

    public void addChatBotMessage(String text) {
        contents.add(Map.of(
            "role", "model",
            "parts", List.of(Map.of("text", text))
        ));
    }
    /* 
     * Check if last of content is json format like this
     * "metadata": {
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
    */
    boolean checkResult() {
        
        return false;
    }
}

