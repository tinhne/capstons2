package com.prediction.backend.repositories;

import com.prediction.backend.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    Optional<Conversation> findBySenderIdAndReceiverId(String senderId, String receiverId);

    List<Conversation> findBySenderIdOrReceiverId(String senderId, String receiverId);

    List<Conversation> findBySenderId(String senderId);

    List<Conversation> findByReceiverId(String receiverId);

    Optional<Conversation> findById(String id);
}