package com.prediction.backend.dto.response;

import com.google.gson.JsonObject;
import com.prediction.backend.models.ChatMessage;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BotResponse {
    ChatMessage data;
    boolean needDoctor;
    String log;
}
