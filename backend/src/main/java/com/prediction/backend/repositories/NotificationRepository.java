package com.prediction.backend.repositories;

import com.prediction.backend.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByReceiver_Id(String receiverId);
}