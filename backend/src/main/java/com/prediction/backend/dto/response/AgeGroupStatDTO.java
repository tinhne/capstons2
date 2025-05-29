package com.prediction.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgeGroupStatDTO {
    private String ageGroup;
    private Long count;
}