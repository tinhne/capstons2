package com.prediction.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private UUID userId;

    private List<Map<String, Object>> contents = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructor
    public Conversation() {}

    public Conversation(UUID userId, List<Map<String, Object>> contents) {
        this.userId = userId;
        this.contents = contents;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public List<Map<String, Object>> getContents() { return contents; }
    public void setContents(List<Map<String, Object>> contents) { this.contents = contents; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
