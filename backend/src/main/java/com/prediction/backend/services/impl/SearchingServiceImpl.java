package com.prediction.backend.services.impl;

import com.prediction.backend.models.Disease;
import com.prediction.backend.models.Symptom;
import com.prediction.backend.repositories.DiseaseSymptomRepository;
import com.prediction.backend.repositories.SymptomRepository;
import com.prediction.backend.repositories.DiseaseRepository;
import com.prediction.backend.services.SearchingService;
import com.prediction.backend.dto.DiseaseMatchDTO;
import com.prediction.backend.dto.request.SearchingRequest;
import com.prediction.backend.dto.response.SearchingResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;

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
public class SearchingServiceImpl implements SearchingService {

    private final SymptomRepository symptomRepository;
    private final DiseaseSymptomRepository diseaseSymptomRepository;
    private final DiseaseRepository diseaseRepository;

    /**
     * Initializes DiagnosisServiceImpl with SymptomRepository and
     * DiseaseSymptomRepository.
     *
     * @param symptomRepository        Repository for accessing symptom data.
     * @param diseaseSymptomRepository Repository for accessing disease-symptom
     *                                 relationship data.
     */
    @Autowired
    public SearchingServiceImpl(DiseaseRepository diseaseRepository, SymptomRepository symptomRepository,
            DiseaseSymptomRepository diseaseSymptomRepository) {
        this.diseaseRepository = diseaseRepository;
        this.symptomRepository = symptomRepository;
        this.diseaseSymptomRepository = diseaseSymptomRepository;
    }

    /**
     * Diagnoses diseases based on a list of symptom names.
     * This method retrieves symptom IDs based on the provided symptom names,
     * then finds diseases associated with those symptoms, ordered by the number of
     * matching symptoms.
     *
     * @param symptomNames A list of symptom names to diagnose from.
     * @return A list of Disease objects, ordered by the number of matching symptoms
     *         (descending).
     *         Returns an empty list if no diseases are found or if no symptoms
     *         match the provided names.
     */
    @Override
    public SearchingResponse search(SearchingRequest searchingRequest) throws AppException {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (searchingRequest == null || searchingRequest.getSymptomNames() == null ||
                    searchingRequest.getSymptomNames().isEmpty()) {
                throw new AppException(ErrorCode.SYMPTOMS_EMPTY);
            }

            // Tìm symptomIds từ symptomNames
            List<String> symptomIds = new ArrayList<>();
            for (String name : searchingRequest.getSymptomNames()) {
                List<Symptom> symptoms = symptomRepository.findByNameOrSynonym(name);
                symptomIds.addAll(symptoms.stream()
                        .map(Symptom::getSymptomId)
                        .collect(Collectors.toList()));
            }
            symptomIds = symptomIds.stream().distinct().collect(Collectors.toList());

            // Kiểm tra nếu không tìm thấy triệu chứng nào phù hợp
            if (symptomIds.isEmpty()) {
                throw new AppException(ErrorCode.NO_MATCHING_SYMPTOMS);
            }

            // Tìm các bệnh có tất cả các triệu chứng
            long symptomCount = symptomIds.size(); // Số lượng triệu chứng đầu vào
            List<Object[]> diseaseMatches = diseaseSymptomRepository.findDiseasesWithAllSymptoms(symptomIds, symptomCount);

            // Chuyển đổi kết quả thành danh sách Disease
            List<Disease> diseases = diseaseMatches.stream()
                    .map(obj -> diseaseRepository.findById((String) obj[0]).orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // Kiểm tra nếu không tìm thấy bệnh nào
            if (diseases.isEmpty()) {
                throw new AppException(ErrorCode.NO_DISEASES_FOUND);
            }

            // Tạo response
            return SearchingResponse.builder()
                    .diseases(diseases)
                    .matchedSymptomCount(symptomIds.size())
                    .message("Chẩn đoán thành công, tìm thấy " + diseases.size() + " bệnh phù hợp với tất cả triệu chứng")
                    .build();

        } catch (AppException e) {
            // Chuyển tiếp các lỗi nghiệp vụ đã được xác định
            throw e;
        } catch (Exception e) {
            // Xử lý các lỗi khác không mong đợi
            throw new AppException(ErrorCode.DIAGNOSIS_PROCESSING_ERROR);
        }
    }
}