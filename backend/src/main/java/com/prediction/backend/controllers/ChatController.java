package com.prediction.backend.controllers;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.request.MessageRequest;
import com.prediction.backend.models.Message;
import com.prediction.backend.models.Room;
import com.prediction.backend.repositories.RoomRepository;

@RestController
@CrossOrigin("http://localhost:3000")
public class ChatController {
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRe) {
        this.roomRepository = roomRe;
    }

    // For sending and receiving message 
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
        @DestinationVariable String roomId,
        @RequestBody MessageRequest request) {

        Room room = roomRepository.findByRoomId(roomId);

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if (null != room) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("Room not found!");
        }

        return message;
    }
}
