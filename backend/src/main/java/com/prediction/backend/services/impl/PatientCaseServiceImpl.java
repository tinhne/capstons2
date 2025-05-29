package com.prediction.backend.services.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prediction.backend.dto.request.DiagnosisRequest;
import com.prediction.backend.models.Notification.NotificationType;
import com.prediction.backend.models.Notification;
import com.prediction.backend.models.PatientCase;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.NotificationRepository;
import com.prediction.backend.repositories.PatientCaseRepository;
import com.prediction.backend.repositories.UserRepository;
import com.prediction.backend.services.NotificationService;
import com.prediction.backend.services.PatientCaseService;

@Service
public class PatientCaseServiceImpl implements PatientCaseService {
    @Autowired
    private PatientCaseRepository patientCaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    // Xử lý gửi dữ liệu cho bác sĩ chuẩn đoán bệnh
    public PatientCase sendToDoctorForDiagnosis(DiagnosisRequest dr, String id_doctor) {
        // Lấy user gửi (bệnh nhân)
        User sender = null;
        if (dr.getId_user() != null) {
            sender = userRepository.findById(dr.getId_user())
                    .orElseThrow(() -> new IllegalArgumentException("User (bệnh nhân) không tồn tại"));
        }

        // Lấy bác sĩ nhận
        User doctor = userRepository.findById(id_doctor)
                .orElseThrow(() -> new IllegalArgumentException("Bác sĩ không tồn tại"));

        // Tạo log ca bệnh
        PatientCase patientCase = new PatientCase();
        patientCase.setGender(dr.getGender());
        patientCase.setAge(dr.getAge());
        patientCase.setLocation(dr.getLocation());
        patientCase.setSymptomStartTime(dr.getSymptomStartTime());
        patientCase.setSymptoms(dr.getSymptoms());
        patientCase.setRiskFactors(dr.getRiskFactors());
        patientCase.setStatus("pending");
        patientCase.setCreatedAt(LocalDateTime.now());

        patientCase.setUser(sender);

        // Tạo notification
        Notification notification = Notification.builder()
                .sender(sender != null ? sender.getName() : "Hệ thống")
                .receiver(doctor)
                .title("Yêu cầu chuẩn đoán bệnh mới")
                .content("Có một ca bệnh mới cần bác sĩ chuẩn đoán.")
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .type(NotificationType.info)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Lưu notification vào DB
        notificationRepository.save(notification);

        // Gắn notification vào patientCase nếu cần (nếu có quan hệ)
        patientCase.setNotification(notification);

        // Lưu log ca bệnh vào DB và trả về bản ghi mới nhất
        PatientCase savedCase = patientCaseRepository.save(patientCase);

        // Gửi notification realtime cho bác sĩ
        notificationService.notifyDoctor(id_doctor, notification);

        return savedCase;
    }
}