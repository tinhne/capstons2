package com.prediction.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.services.ChartService;

@RestController
@RequestMapping("/api/chart-data")
public class ChartController {
    @Autowired
    ChartService chartService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getChartData() {
        return ApiResponse.<Map<String, Object>>builder()
                .message("thanhcong")
                .data(chartService.getChartData())
                .build();
    }
}
