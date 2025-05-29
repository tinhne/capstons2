package com.prediction.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchingRequest {
    @NotEmpty(message = "SYMPTOMS_EMPTY")
    List<String> symptomNames;
}