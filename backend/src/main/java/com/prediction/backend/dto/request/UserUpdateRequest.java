package com.prediction.backend.dto.request;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserUpdateRequest {
    String name; // User name
    Integer age; // User age
    Gender gender; // User gender
    public enum Gender {
        Male, Female, Other 
    }
    String address; // User address

    String district; // Restrict

    String city; // City 
    String underlyingDisease; // Underlying disease 
    String password; // Password
    List<String> roles;
}