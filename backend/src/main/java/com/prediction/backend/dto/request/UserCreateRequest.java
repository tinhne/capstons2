package com.prediction.backend.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserCreateRequest {
    @NotBlank(message = "Name cannot blank")
	@Size(max=255, message="Not long over 255 characters")
    @Column(nullable = false)
    String name; // User name

    Integer age; // User age

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Gender gender; // User gender

    String address; // User address

    String district; // Restrict

    String city; // City 
    
    @Column(name = "underlying_disease")
    String underlyingDisease; // Underlying disease 

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email cannot blank")
    @Email(message="Email is invalid")
    @Size(max=255, message="Not long over 255 characters")
    String email; // Email (User name)

	@Size(min=8, message="Password must be at least 8 characters")
    @Column(nullable = false)
    String password; // Password

    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false)
    // Role role; // User role

    // Enumerations for Gender
    public enum Gender {
        Male, Female, Other 
    }

}
