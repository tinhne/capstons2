package com.prediction.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.prediction.backend.models.Room;

public interface RoomRepository extends MongoRepository<Room, String>{
    // get room by room id 
    Room findByRoomId (String roomId);
}
