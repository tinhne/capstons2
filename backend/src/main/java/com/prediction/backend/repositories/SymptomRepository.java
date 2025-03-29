package com.prediction.backend.repositories;

import com.prediction.backend.models.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Symptom entities.
 * Provides basic CRUD operations and custom query methods for the 'symptoms' table.
 */
@Repository
public interface SymptomRepository extends JpaRepository<Symptom, String> {

    /**
     * Retrieves a list of symptoms by their English name, ignoring case sensitivity.
     *
     * @param nameEn the English name of the symptom to search for
     * @return a list of symptoms matching the provided English name
     */
    List<Symptom> findByNameEnIgnoreCase(String nameEn);

    /**
     * Retrieves a list of symptoms by their Vietnamese name, ignoring case sensitivity.
     *
     * @param nameVn the Vietnamese name of the symptom to search for
     * @return a list of symptoms matching the provided Vietnamese name
     */
    List<Symptom> findByNameVnIgnoreCase(String nameVn);
    /**
     * Retrieves a list of symptoms by searching for a keyword within their synonyms.
     * The search is case-insensitive and matches any part of the synonym text.
     *
     * @param keyword the keyword to search for within the synonym field
     * @return a list of symptoms whose synonyms contain the provided keyword
     */
    @Query("SELECT s FROM Symptom s WHERE LOWER(s.synonym) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Symptom> findBySynonymContaining(@Param("keyword") String keyword);
    
    /**
     * Finds a list of symptoms where the English name, Vietnamese name, or synonym matches the given name (case-insensitive).
     * The search is performed using a "LIKE" clause for the synonym, allowing partial matches.
     *
     * @param name The name to search for in English name, Vietnamese name, or synonym.
     * @return A list of Symptom objects that match the given name.
     * Returns an empty list if no matching symptoms are found.
     */
    @Query("SELECT s FROM Symptom s WHERE LOWER(s.nameEn) = LOWER(:name) OR LOWER(s.nameVn) = LOWER(:name) OR LOWER(s.synonym) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Symptom> findByNameOrSynonym(@Param("name") String name);
    
    /**
     * Retrieves a list of symptoms by their frequency of occurrence.
     *
     * @param frequency the frequency level to filter by (e.g., RARE, OCCASIONAL, FREQUENT, CONSTANT)
     * @return a list of symptoms with the specified frequency
     */
    List<Symptom> findByFrequency(Symptom.Frequency frequency);
}