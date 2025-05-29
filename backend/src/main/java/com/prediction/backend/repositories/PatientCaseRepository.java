package com.prediction.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prediction.backend.models.PatientCase;

@Repository
public interface PatientCaseRepository extends JpaRepository<PatientCase, Long> {
    List<PatientCase> findAll();

   PatientCase findByNotification_Id(String notificationId);
}
