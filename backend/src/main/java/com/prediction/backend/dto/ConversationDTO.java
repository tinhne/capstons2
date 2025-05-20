package com.prediction.backend.dto;

import java.util.List;
import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

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

    public static boolean isValidMedicalJsonFormat(String jsonString) {
        try {
            // Loại bỏ dấu ```json và ``` nếu có
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.replaceAll("(?s)```json\\s*", ""); // bỏ ```json + xuống dòng
                jsonString = jsonString.replaceAll("```\\s*$", ""); // bỏ ``` cuối
            }

            JsonObject obj = JsonParser.parseString(jsonString).getAsJsonObject();

            // Check metadata
            if (!obj.has("metadata") || !obj.get("metadata").isJsonObject())
                return false;
            JsonObject metadata = obj.getAsJsonObject("metadata");
            if (!metadata.has("age") || !metadata.has("gender") || !metadata.has("region"))
                return false;

            if (!metadata.get("age").isJsonPrimitive() || !metadata.get("age").getAsJsonPrimitive().isNumber())
                return false;

            String gender = metadata.get("gender").getAsString();
            if (!List.of("Male", "Female", "Other").contains(gender))
                return false;

            if (!metadata.get("region").isJsonPrimitive() || !metadata.get("region").getAsJsonPrimitive().isString())
                return false;

            // Check symptoms
            if (!obj.has("symptoms") || !obj.get("symptoms").isJsonArray())
                return false;
            JsonArray symptoms = obj.getAsJsonArray("symptoms");

            for (int i = 0; i < symptoms.size(); i++) {
                JsonObject sym = symptoms.get(i).getAsJsonObject();
                if (!sym.has("name") || !sym.has("level"))
                    return false;

                String level = sym.get("level").getAsString();
                if (!List.of("mild", "moderate", "severe").contains(level))
                    return false;
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}