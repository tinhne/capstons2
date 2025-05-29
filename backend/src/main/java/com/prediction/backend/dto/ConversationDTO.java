package com.prediction.backend.dto;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
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

    // public static boolean isJsonValid(String jsonString) {
    // try {
    // // Loại bỏ dấu ```json và ``` nếu có
    // if (jsonString.startsWith("```json")) {
    // jsonString = jsonString.replaceAll("(?s)```json\\s*", "");
    // jsonString = jsonString.replaceAll("```\\s*$", "");
    // }

    // JsonElement jsonElement = JsonParser.parseString(jsonString);
    // return jsonElement.isJsonObject() || jsonElement.isJsonArray();
    // } catch (Exception e) {
    // return false;
    // }
    // }
    public static boolean isJsonValid(String input) {
        try {
            // Tìm đoạn json nằm giữa ```json và ```
            Pattern pattern = Pattern.compile("```json\\s*(\\{.*?})\\s*```", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(input);

            if (matcher.find()) {
                String jsonString = matcher.group(1).trim();
                JsonElement jsonElement = JsonParser.parseString(jsonString);
                return jsonElement.isJsonObject() || jsonElement.isJsonArray();
            }

            // Nếu không tìm thấy theo kiểu markdown, thử tìm chuỗi JSON thuần túy trong
            // input
            input = input.trim();
            if (input.startsWith("{") || input.startsWith("[")) {
                JsonElement jsonElement = JsonParser.parseString(input);
                return jsonElement.isJsonObject() || jsonElement.isJsonArray();
            }

        } catch (Exception e) {
            // JSON không hợp lệ
        }
        return false;
    }

    public static Optional<String> extractJsonFromText(String input) {
        // Tìm đoạn json nằm giữa ```json ... ```
        Pattern pattern = Pattern.compile("```json\\s*(\\{.*?})\\s*```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return Optional.of(matcher.group(1).trim());
        }

        // Nếu không có markdown, thử xem toàn bộ input là JSON
        input = input.trim();
        if (input.startsWith("{") || input.startsWith("[")) {
            return Optional.of(input);
        }

        return Optional.empty();
    }

    public static List<String> extractSymptoms(String jsonString) throws Exception {
        List<String> symptomsList = new ArrayList();
        try {
            // Loại bỏ dấu ```json và ``` nếu có
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.replaceAll("(?s)```json\\s*", "");
                jsonString = jsonString.replaceAll("```\\s*$", "");
            }
            // logic get list of symptoms
            JsonObject obj = JsonParser.parseString(jsonString).getAsJsonObject();
            if (obj.has("symptoms") && obj.get("symptoms").isJsonArray()) {
                JsonArray symptoms = obj.getAsJsonArray("symptoms");
                for (JsonElement element : symptoms) {
                    if (element.isJsonPrimitive() && element.getAsJsonPrimitive().isString()) {
                        symptomsList.add(element.getAsString());
                    }
                }
            }
        } catch (Exception e) {
            throw new Exception("Error wth extract symptoms");
        }
        return symptomsList;
    }

    public static String removeJsonBlock(String text) {
        return text.replaceAll("(?s)```json\\s*\\{.*?\\}\\s*```", "").trim();
    }
}