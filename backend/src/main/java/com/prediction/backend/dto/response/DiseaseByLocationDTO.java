package com.prediction.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseByLocationDTO {
    private String location;
    private String disease;
    private Long count;
}