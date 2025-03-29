package com.prediction.backend.services.impl;

import com.prediction.backend.models.Disease;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.repositories.DiseaseSymptomRepository;
import com.prediction.backend.repositories.SymptomRepository;
import com.prediction.backend.repositories.DiseaseRepository;
import com.prediction.backend.services.DiagnosisService;
import com.prediction.backend.dto.DiseaseMatchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

/**
 * Implementation of the DiagnosisService interface.
 * Provides functionality to diagnose diseases based on a list of symptom names.
 */
@Service
public class DiagnosisServiceImpl implements DiagnosisService {

    private final SymptomRepository symptomRepository;
    private final DiseaseSymptomRepository diseaseSymptomRepository;
    private final DiseaseRepository diseaseRepository;

    /**
     * Initializes DiagnosisServiceImpl with SymptomRepository and DiseaseSymptomRepository.
     *
     * @param symptomRepository        Repository for accessing symptom data.
     * @param diseaseSymptomRepository Repository for accessing disease-symptom relationship data.
     */
    @Autowired
    public DiagnosisServiceImpl(DiseaseRepository diseaseRepository, SymptomRepository symptomRepository, DiseaseSymptomRepository diseaseSymptomRepository) {
        this.diseaseRepository = diseaseRepository;
    	this.symptomRepository = symptomRepository;
        this.diseaseSymptomRepository = diseaseSymptomRepository;
    }

    /**
     * Diagnoses diseases based on a list of symptom names.
     * This method retrieves symptom IDs based on the provided symptom names,
     * then finds diseases associated with those symptoms, ordered by the number of matching symptoms.
     *
     * @param symptomNames A list of symptom names to diagnose from.
     * @return A list of Disease objects, ordered by the number of matching symptoms (descending).
     * Returns an empty list if no diseases are found or if no symptoms match the provided names.
     */
    @Override
    public List<Disease> diagnose(List<String> symptomNames) {

        List<String> symptomIds = new ArrayList<>();
        for (String name : symptomNames) {
            List<Symptom> symptoms = symptomRepository.findByNameOrSynonym(name);
            symptomIds.addAll(symptoms.stream().map(Symptom::getSymptomId).collect(Collectors.toList()));
        }
        symptomIds = symptomIds.stream().distinct().collect(Collectors.toList());

        if (symptomIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<DiseaseMatchDTO> diseaseMatches = diseaseSymptomRepository.findDiseasesBySymptoms(symptomIds);

        return diseaseMatches.stream()
                .map(dto -> diseaseRepository.findById(dto.getDiseaseId()).orElse(null)) // Tìm Disease theo ID
                .filter(Objects::nonNull) // Lọc bỏ các giá trị null
                .collect(Collectors.toList());

    }
}