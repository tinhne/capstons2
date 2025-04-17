package com.prediction.backend.repositories;

import com.prediction.backend.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findBySenderIdOrReceiverId(String senderId, String receiverId);
}