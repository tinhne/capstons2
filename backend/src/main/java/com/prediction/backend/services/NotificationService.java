package com.prediction.backend.services;

import com.prediction.backend.models.Notification;

public interface NotificationService {
    public void notifyDoctor(String id_doctor, Notification notification);

    public void notifyUser(String userId, Notification notification);

}