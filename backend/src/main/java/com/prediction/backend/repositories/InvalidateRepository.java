package com.prediction.backend.repositories;

import com.prediction.backend.models.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidateRepository extends JpaRepository<InvalidatedToken, String> {

}