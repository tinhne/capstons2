package com.prediction.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.Message;
import com.prediction.backend.models.Room;
import com.prediction.backend.repositories.RoomRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("http://localhost:3000")
public class RoomController {
    
    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    // create room 
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRoom(@RequestBody String roomId){
        
        if (roomRepository.findByRoomId(roomId) != null) {
            ApiResponse<?> response = ApiResponse.builder()
                .status(1001)
                .message("Room already exists!")
                .build();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); 
        }
        
        // create a new room 
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);

        ApiResponse<?> response = ApiResponse.builder()
                .status(1000)
                .message("Created room sucessfully!") // Using Vietnamese as in your other example
                .data(savedRoom)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    // get room: join
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<?>> joinRoom(@PathVariable String roomId){
        Room room = roomRepository.findByRoomId(roomId);

        if (null == room) {
            ApiResponse<?> response = ApiResponse.builder()
                .status(1002)
                .message("Room is not found!")
                .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        ApiResponse<?> response = ApiResponse.builder()
            .status(1000)
            .message("Room found!")
            .data(room) 
            .build();
        return ResponseEntity.ok(response); 
    }

    // get message of room 
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessage(
        @PathVariable String roomId,
        @RequestParam(value="page", defaultValue = "0", required = false) int page,
        @RequestParam(value="size", defaultValue = "20", required = false) int size
    ) {
        Room room = roomRepository.findByRoomId(roomId);

        if (null == room) {
            ApiResponse<?> response = ApiResponse.builder()
                .status(1002)
                .message("Room is not found!")
                .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        List<Message> allMessages = room.getMessages();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allMessages.size());

        List<Message> pagedMessages = allMessages.subList(startIndex, endIndex);

        ApiResponse<List<Message>> response = ApiResponse.<List<Message>>builder()
                .status(1000)
                .message("Successfully retrieved messages!")
                .data(pagedMessages)
                .build();

        return ResponseEntity.ok(response);
    }
    
}
