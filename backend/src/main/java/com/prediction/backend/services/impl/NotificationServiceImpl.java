package com.prediction.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.prediction.backend.models.Notification;
import com.prediction.backend.services.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyDoctor(String id_doctor, Notification notification) {
        // Gửi notification tới topic riêng của bác sĩ theo userId
        messagingTemplate.convertAndSend("/topic/doctor-notifications/" + id_doctor, notification);
    }

    @Override
    public void notifyUser(String userId, Notification notification) {
        // Gửi đến user qua queue
        messagingTemplate.convertAndSendToUser(
                userId, // userId phải là String
                "/queue/notifications",
                notification);
    }
}
