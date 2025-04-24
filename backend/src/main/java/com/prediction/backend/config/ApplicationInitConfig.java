package com.prediction.backend.config;

import java.util.HashSet;
import java.util.Optional;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
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
        static final String DOCTOR_USER_EMAIL = "doctor@gmail.com";
        static final String DOCTOR_PASSWORD = "doctor";
        static final String BOT_EMAIL = "bot@system.local";

        @Bean
        @Profile("!test")
        @ConditionalOnProperty(prefix = "spring", value = "datasource.driverClassName", havingValue = "com.mysql.cj.jdbc.Driver")
        ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
                return args -> {
                        Optional<User> adminUser = userRepository.findByEmail(ADMIN_USER_EMAIL);
                        Optional<User> doctorUser = userRepository.findByEmail(DOCTOR_USER_EMAIL);
                        Optional<User> Bot = userRepository.findByEmail(BOT_EMAIL);
                        if (doctorUser.isEmpty()) {
                                Role doctRole = roleRepository.save(Role.builder()
                                                .name(PredefinedRole.DOCTOR_ROLE)
                                                .description("Doctor role")
                                                .build());
                                HashSet<Role> roles = new HashSet<>();
                                roles.add(doctRole);
                                User user = User.builder()
                                                .name("DOCTOR")
                                                .email(DOCTOR_USER_EMAIL)
                                                .password(passwordEncoder.encode(DOCTOR_PASSWORD))
                                                .roles(roles)
                                                .build();
                                userRepository.save(user);
                        }
                        if (Bot.isEmpty()) {
                                Role botRole = roleRepository.save(Role.builder()
                                                .name(PredefinedRole.BOT_ROLE)
                                                .description("Bot Role")
                                                .build());
                                HashSet<Role> roles = new HashSet<>();
                                roles.add(botRole);

                                User bot = User.builder()
                                                .name("Health Assistant Bot")
                                                .email("bot@system.local")
                                                .password(passwordEncoder.encode("222")) // hoặc để trống nếu
                                                .roles(roles)
                                                .build();
                                userRepository.save(bot);
                        }
                        if (adminUser.isEmpty()) {
                                roleRepository.save(Role.builder()
                                                .name(PredefinedRole.USER_ROLE)
                                                .description("User role")
                                                .build());

                                Role adminRole = roleRepository.save(Role.builder()
                                                .name(PredefinedRole.ADMIN_ROLE)
                                                .description("Admin role")
                                                .build());

                                HashSet<Role> roles = new HashSet<>();
                                roles.add(adminRole);

                                User user = User.builder()
                                                .name("ADMIN")
                                                .email(ADMIN_USER_EMAIL)
                                                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                                                .roles(roles)
                                                .build();

                                userRepository.save(user);
                                log.info("Admin user created with email: {} and password: {}", ADMIN_USER_EMAIL,
                                                ADMIN_PASSWORD); // Corrected
                                                                 // log
                                                                 // formatting
                        }

                        log.info("Application initialization completed."); // Standardized log message
                };
        }
}