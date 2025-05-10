package com.prediction.backend.repositories;

import com.prediction.backend.models.DiagnoseForm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnoseFormRepository extends JpaRepository<DiagnoseForm, Integer> {
}