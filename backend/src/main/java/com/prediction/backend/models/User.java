package com.prediction.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id; // User id

    @Size(max=255, message="Not long over 255 characters")
    @Column(nullable = false, unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String name; // User name

    Integer age; // User age

    Gender gender; // User gender

    String address; // User address

    String district; // Restrict

    String city; // City 
    
    @Column(name = "underlying_disease")
    String underlyingDisease; // Underlying disease 

    String email; // Email (User name)

    String password; // Password

    public enum Gender {
        Male, Female, Other 
    }

    @ManyToMany
    Set<Role> roles;
}