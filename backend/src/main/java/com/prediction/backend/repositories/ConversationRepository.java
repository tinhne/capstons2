package com.prediction.backend.repositories;

import com.prediction.backend.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    // Tìm conversation có đúng 2 participantIds (không phân biệt thứ tự)
    @Query("{ 'participantIds': { $all: ?0 }, '$expr': { '$eq': [{ '$size': '$participantIds' }, ?1] } }")
    Optional<Conversation> findByExactParticipants(List<String> participantIds, int size);

    // Tìm tất cả conversation mà participantIds chứa userId
    List<Conversation> findByParticipantIdsContaining(String userId);
}