package com.prediction.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.response.AgeGroupStatDTO;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.DiseaseByLocationDTO;
import com.prediction.backend.dto.response.DiseaseBySeasonDTO;
import com.prediction.backend.dto.response.GenderStatDTO;
import com.prediction.backend.dto.response.WordCloudItemDTO;
import com.prediction.backend.services.StatisticsService;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/disease-by-season")
    public ApiResponse<List<DiseaseBySeasonDTO>> getDiseaseBySeason() {
        return ApiResponse.<List<DiseaseBySeasonDTO>>builder()
                .message("Thanh cong")
                .data(statisticsService.getDiseaseBySeasonStats())
                .build();
    }

    @GetMapping("/disease-by-location")
    public ApiResponse<List<DiseaseByLocationDTO>> getDiseaseByLocation() {
        return ApiResponse.<List<DiseaseByLocationDTO>>builder()
                .message("Thanh cong")
                .data(statisticsService.getDiseaseByLocationStats())
                .build();
    }


    @GetMapping("/gender")
    public ApiResponse<List<GenderStatDTO>> getGenderStats() {
        return ApiResponse.<List<GenderStatDTO>>builder()
                .message("Thanh cong")
                .data(statisticsService.getGenderStats())
                .build();
    }

    @GetMapping("/age-group")
    public ApiResponse<List<AgeGroupStatDTO>> getAgeGroupStats() {
        return ApiResponse.<List<AgeGroupStatDTO>>builder()
                .message("Thanh cong")
                .data(statisticsService.getAgeGroupStats())
                .build();
    }

}
