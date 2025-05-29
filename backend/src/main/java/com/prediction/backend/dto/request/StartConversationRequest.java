package com.prediction.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StartConversationRequest {
    String senderId;
    String receiverId;
    String firstMessage;

}
