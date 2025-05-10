package com.prediction.backend.config;

import org.springframework.stereotype.Component;

@Component
public class ChatBotConfig {
    public static final String API_KEY = "AIzaSyAh7S_O7ScX6BnWwqV59DoYBCUGyvHN9gY";
    public static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" + "?key=" + API_KEY;
}

