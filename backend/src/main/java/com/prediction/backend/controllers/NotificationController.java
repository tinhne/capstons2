package com.prediction.backend.controllers;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.models.Notification;
import com.prediction.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Lấy danh sách notification của user
    @GetMapping
    public ApiResponse<List<Notification>> getNotifications(@RequestParam String userId) {
        List<Notification> notifications = notificationRepository.findByReceiver_Id(userId);
        return ApiResponse.<List<Notification>>builder()
                .message("Danh sách thông báo")
                .data(notifications)
                .build();
    }

    // Đánh dấu đã đọc notification
    @PostMapping("/read/{id}")
    public ApiResponse<Notification> markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
        return ApiResponse.<Notification>builder()
                .message("Đã đánh dấu đã đọc")
                .data(notification)
                .build();
    }

    // Xem chi tiết notification
    @GetMapping("/{id}")
    public ApiResponse<Notification> getNotification(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        return ApiResponse.<Notification>builder()
                .message("Chi tiết thông báo")
                .data(notification)
                .build();
    }
}