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
public class DiagnoseDiseaseRequest {
    Long id;
    List<String> symptoms;
    List<String> riskFactors;
    String predicted_disease;
}
