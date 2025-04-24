package com.prediction.backend.dto.response;

import com.prediction.backend.models.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;
    String refreshToken;
    Long expiresIn;
    boolean authenticated;
    User user;
}