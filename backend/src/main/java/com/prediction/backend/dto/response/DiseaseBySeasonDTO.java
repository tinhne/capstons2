package com.prediction.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseBySeasonDTO {
    private String season;
    private String disease;
    private Long count;
}
