package com.prediction.backend.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DiagnosisRequest {
    String gender;
    int age;
    String location;
    LocalDateTime symptomStartTime;
    List<String> symptoms;
    List<String> riskFactors;
    String id_user;
}