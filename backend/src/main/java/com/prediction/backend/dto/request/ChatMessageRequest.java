package com.prediction.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageRequest {
    String conversationId;
    String senderId;
    String senderRole; // "DOCTOR" or "USER"
    String content;
}
