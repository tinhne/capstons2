package com.prediction.backend.config;

import java.util.HashSet;
import java.util.Optional;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.prediction.backend.constants.PredefinedRole;
import com.prediction.backend.models.Role;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.RoleRepository;
import com.prediction.backend.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    static final String ADMIN_USER_EMAIL = "admin@gmail.com";
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    @ConditionalOnProperty(prefix = "spring", value = "datasource.driverClassName", havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            Optional<User> adminUser = userRepository.findByEmail(ADMIN_USER_EMAIL);

            if (adminUser.isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build()
                );

                HashSet<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User user = User.builder()
                        .name("ADMIN")
                        .email(ADMIN_USER_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.info("Admin user created with email: {} and password: {}", ADMIN_USER_EMAIL, ADMIN_PASSWORD); // Corrected log formatting
            }

            log.info("Application initialization completed."); // Standardized log message
        };
    }
}