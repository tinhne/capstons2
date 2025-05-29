package com.prediction.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký endpoint WebSocket, cho phép kết nối từ các nguồn khác nhau
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Định nghĩa các prefix cho message broker
        registry.enableSimpleBroker("/topic"); // Prefix cho các topic
        registry.setApplicationDestinationPrefixes("/app"); // Prefix cho các message gửi đến ứng dụng
        registry.setUserDestinationPrefix("/user");

    }
}