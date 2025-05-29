package com.prediction.backend.dto.response;

import com.prediction.backend.dto.DiseasePrediction;
import lombok.Data;
import reactor.core.publisher.Mono;
import java.util.List;

@Data
public class PredictionResponse {
    private List<DiseasePrediction> top_predictions;
    // private int requested_top_k;
    // private int total_classes;
    // private String message;

    // public static boolean checkConfident(Mono<PredictionResponse> prs) {
    //     List<DiseasePrediction> diseases = prs.map(diseases -> getTop_predictions());
    //     for (DiseasePrediction disease : diseases) {
    //         if (disease.getProbability_percentage() > 60.0) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // public static Mono<Boolean> checkConfident(Mono<PredictionResponse> monoPrediction) {
    //     return monoPrediction.map(prs -> {
    //         List<DiseasePrediction> diseases = prs.getTop_predictions();
    //         for (DiseasePrediction disease : diseases) {
    //             if (disease.getProbability_percentage() > 60.0) {
    //                 return true;
    //             }
    //         }
    //         return false;
    //     });
    // }
    public static boolean checkConfident(PredictionResponse prs) {
        return prs.getTop_predictions().stream()
            .anyMatch(d -> d.getProbability_percentage() > 60.0);
    }


}