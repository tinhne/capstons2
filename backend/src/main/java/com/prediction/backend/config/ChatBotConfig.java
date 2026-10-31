package com.prediction.backend.config;

import org.springframework.stereotype.Component;

@Component
public class ChatBotConfig {
    public static final String API_KEY = System.getProperty("gemini.api.key",
            System.getenv().getOrDefault("GEMINI_API_KEY", ""));
    public static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
            + "?key=" + API_KEY;
}