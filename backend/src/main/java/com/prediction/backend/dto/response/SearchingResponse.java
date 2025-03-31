package com.prediction.backend.dto.response;

import com.prediction.backend.models.Disease;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchingResponse {
    List<Disease> diseases;
    int matchedSymptomCount;
    String message;
}