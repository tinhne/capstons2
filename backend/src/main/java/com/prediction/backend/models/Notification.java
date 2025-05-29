package com.prediction.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String sender;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

    private Boolean isRead = false;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum NotificationType {
        info, warning, success, error
    }

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;
}