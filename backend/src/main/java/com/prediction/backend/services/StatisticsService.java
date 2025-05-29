package com.prediction.backend.services;

import java.util.List;

import com.prediction.backend.dto.response.AgeGroupStatDTO;
import com.prediction.backend.dto.response.DiseaseByLocationDTO;
import com.prediction.backend.dto.response.DiseaseBySeasonDTO;
import com.prediction.backend.dto.response.GenderStatDTO;
import com.prediction.backend.dto.response.WordCloudItemDTO;

public interface StatisticsService {
    public List<DiseaseBySeasonDTO> getDiseaseBySeasonStats();

    public List<DiseaseByLocationDTO> getDiseaseByLocationStats();

    public List<WordCloudItemDTO> getSymptomWordCloud();

    public List<WordCloudItemDTO> getRiskFactorWordCloud();

    public List<GenderStatDTO> getGenderStats();

    public List<AgeGroupStatDTO> getAgeGroupStats();
}
