package com.prediction.backend.dto.response;

import java.util.Set;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String email;
    String name; // User name
    Integer age; // User age
    Gender gender; // User gender
    String address; // User address
    String district; // Restrict
    String city; // City

    public enum Gender {
        Male, Female, Other
    }

    Set<RoleResponse> roles;
    String underlyingDisease;
    String specialization;
}