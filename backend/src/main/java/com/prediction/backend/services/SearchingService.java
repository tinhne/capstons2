package com.prediction.backend.services;

import com.prediction.backend.dto.request.SearchingRequest;
import com.prediction.backend.dto.response.SearchingResponse;
import com.prediction.backend.exceptions.AppException;

public interface SearchingService {
     /**
      * Diagnoses diseases based on the provided list of symptoms name.
      *
      * @param symptoms A list of symptom name.
      * @return A Diagnosis object containing the diagnosis result.
      */
     SearchingResponse search(SearchingRequest searchingRequest) throws AppException;
}