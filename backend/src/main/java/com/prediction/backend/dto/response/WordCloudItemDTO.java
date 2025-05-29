package com.prediction.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordCloudItemDTO {
    private String text;
    private int value;
}