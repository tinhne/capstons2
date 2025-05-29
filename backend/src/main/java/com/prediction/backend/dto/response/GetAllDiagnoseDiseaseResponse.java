package com.prediction.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetAllDiagnoseDiseaseResponse {
    Long id;
    String gender;
    Integer age;
    String location;
    LocalDateTime symptomStartTime;
    List<String> symptoms; // sửa lại chữ thường
    List<String> riskFactors;
    String predictedDisease;
    String notificationId;
    String notificationTitle;
    String notificationContent;
    String status;
}
