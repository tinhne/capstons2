package com.prediction.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenderStatDTO {
    private String gender;
    private Long count;
}