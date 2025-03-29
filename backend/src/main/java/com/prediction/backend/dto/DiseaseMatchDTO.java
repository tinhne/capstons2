package com.prediction.backend.dto;

public class DiseaseMatchDTO {
    private String diseaseId;
    private Long matchCount;

    public DiseaseMatchDTO(String diseaseId, Long matchCount) {
        this.diseaseId = diseaseId;
        this.matchCount = matchCount;
    }

    public String getDiseaseId() { return diseaseId; }
    public Long getMatchCount() { return matchCount; }
}

