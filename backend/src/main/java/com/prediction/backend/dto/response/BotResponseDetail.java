package com.prediction.backend.dto.response;

import reactor.core.publisher.Mono;

import com.google.gson.JsonObject;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BotResponseDetail {
    private String data;
    private boolean isNeededDoctor;
    private String log;

}
