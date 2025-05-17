package com.prediction.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartConversationRequest {
    private String senderId;
    private String receiverId;
    private String firstMessage;

}
