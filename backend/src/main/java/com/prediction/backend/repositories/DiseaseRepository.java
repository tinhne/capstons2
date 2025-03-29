package com.prediction.backend.repositories;

import com.prediction.backend.models.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing Disease entities.
 * Provides basic CRUD operations and custom query methods for the 'diseases' table.
 */
@Repository
public interface DiseaseRepository extends JpaRepository<Disease, String> {

    /**
     * Retrieves a list of diseases by their English name, ignoring case sensitivity.
     *
     * @param nameEn the English name of the disease to search for
     * @return a list of diseases matching the provided English name
     */
    List<Disease> findByNameEnIgnoreCase(String nameEn);

    /**
     * Retrieves a list of diseases by their Vietnamese name, ignoring case sensitivity.
     *
     * @param nameVn the Vietnamese name of the disease to search for
     * @return a list of diseases matching the provided Vietnamese name
     */
    List<Disease> findByNameVnIgnoreCase(String nameVn);

    /**
     * Retrieves a list of disease by both Vietnamese and English name, ignoring case sensitivity.
     * 
     * @param keyword
     * @return a list of diseases matching the provided keyword.
     */
    @Query("SELECT d FROM Disease d WHERE LOWER(d.nameEn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.nameVn) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Disease> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Retrieves a list of diseases by their severity level.
     *
     * @param severity the severity level to filter by (e.g., LOW, MEDIUM, HIGH)
     * @return a list of diseases with the specified severity level
     */
    List<Disease> findBySeverity(Disease.Severity severity);

    /**
     * Retrieves a list of diseases by their associated medical specialization.
     *
     * @param specialization the medical specialization to filter by
     * @return a list of diseases related to the specified specialization
     */
    List<Disease> findBySpecialization(String specialization);
    
}