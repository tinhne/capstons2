// package com.prediction.backend.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
// import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
// import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//     @Override
//     public void configureMessageBroker(MessageBrokerRegistry config) {

//         config.enableSimpleBroker("/topic");
//         // /topic/messages
//         config.setApplicationDestinationPrefixes("/app");
//         // /app/chat
//         // server-side @MessageMapping("/chat")
//     }

//     @Override
//     public void registerStompEndpoints(StompEndpointRegistry registry) {
//         // registry.addEndpoint("/chat")
//         //     .setAllowedOrigins("*")
//         //     .withSockJS();
//         registry.addEndpoint("/chat")
//         .setAllowedOrigins("http://localhost:3000", "http://127.0.0.1:5500")
//         .withSockJS();

//     }
    
// }
package com.prediction.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // For receiving messages
        config.setApplicationDestinationPrefixes("/app"); // For sending messages
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")
                .setAllowedOrigins("*") // Thêm origin ở đây
                .withSockJS(); // hỗ trợ fallback
    }
}
