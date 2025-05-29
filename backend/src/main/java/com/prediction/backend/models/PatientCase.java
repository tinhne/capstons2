package com.prediction.backend.models;

import com.prediction.backend.converter.StringListJsonConverter;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.ObjectInputFilter.Status;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "chat_logs")
public class PatientCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10)
    private String gender;

    @Column(length = 255)
    private String location;

    @Column(name = "symptom_start_time")
    private LocalDateTime symptomStartTime;

    @Column(columnDefinition = "json")
    @Convert(converter = StringListJsonConverter.class)
    private List<String> symptoms;

    @Column(name = "predicted_disease")
    private String predictedDisease;

    private String season;

    @Column(columnDefinition = "json")
    @Convert(converter = StringListJsonConverter.class)
    private List<String> riskFactors;

    private Integer age;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_notification")
    private Notification notification;

    private String Status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
