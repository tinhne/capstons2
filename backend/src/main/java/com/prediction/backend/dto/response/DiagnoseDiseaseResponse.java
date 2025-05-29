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
public class DiagnoseDiseaseResponse {
    Long id;
    String gender;
    Integer age;
    String location;
    LocalDateTime symptomStartTime;
    List<String> Symptoms;
    List<String> riskFactors;
}
