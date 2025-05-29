package com.prediction.backend.dto.request;

import com.prediction.backend.models.ChatMessage;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserDetailRequest {
    ChatMessage userMessage;
    Integer age;
    String gender;
    String underlying_disease;
}