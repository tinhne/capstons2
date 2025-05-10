package com.prediction.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.prediction.backend.models.Conversation;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByUserId(Long userId);
}
