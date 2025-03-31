package com.prediction.backend.repositories;

import com.prediction.backend.models.DiseaseSymptom;

import com.prediction.backend.models.DiseaseSymptomId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import com.prediction.backend.dto.DiseaseMatchDTO;

@Repository
public interface DiseaseSymptomRepository extends JpaRepository<DiseaseSymptom, DiseaseSymptomId> {

    @Query(value = """
        SELECT ds.disease_id, ds.symptom_id, ds.weight, d.name_en AS disease_name, s.name_en AS symptom_name
        FROM disease_symptom ds
        JOIN diseases d ON ds.disease_id = d.disease_id
        JOIN symptoms s ON ds.symptom_id = s.symptom_id
        WHERE ds.disease_id = :diseaseId
    """, nativeQuery = true)
    List<Map<String, Object>> findByDiseaseId(@Param("diseaseId") String diseaseId);

    @Query(value = """
        SELECT ds.disease_id, ds.symptom_id, ds.weight, d.name_en AS disease_name, s.name_en AS symptom_name
        FROM disease_symptom ds
        JOIN diseases d ON ds.disease_id = d.disease_id
        JOIN symptoms s ON ds.symptom_id = s.symptom_id
        WHERE ds.symptom_id = :symptomId
    """, nativeQuery = true)
    List<Map<String, Object>> findBySymptomId(@Param("symptomId") String symptomId);

    @Query(value = """
        SELECT ds.disease_id, ds.symptom_id, ds.weight, d.name_en AS disease_name, s.name_en AS symptom_name
        FROM disease_symptom ds
        JOIN diseases d ON ds.disease_id = d.disease_id
        JOIN symptoms s ON ds.symptom_id = s.symptom_id
        WHERE ds.symptom_id IN (:symptomIds)
    """, nativeQuery = true)
    List<Map<String, Object>> findBySymptomIds(@Param("symptomIds") List<String> symptomIds);
    
    /**
     * Finds a list of DiseaseSymptom entities associated with a specific disease ID.
     *
     * @param diseaseId The ID of the disease to search for.
     * @return A list of DiseaseSymptom entities related to the specified disease.
     * Returns an empty list if no matching DiseaseSymptom entities are found.
     */
    List<DiseaseSymptom> findByIdDiseaseId(String diseaseId);

    /**
     * Finds a list of DiseaseSymptom entities associated with a specific symptom ID.
     *
     * @param symptomId The ID of the symptom to search for.
     * @return A list of DiseaseSymptom entities related to the specified symptom.
     * Returns an empty list if no matching DiseaseSymptom entities are found.
     */
    List<DiseaseSymptom> findByIdSymptomId(String symptomId);

    /**
     * Finds a list of DiseaseSymptom entities associated with a list of symptom IDs.
     *
     * @param symptomIds A list of symptom IDs to search for.
     * @return A list of DiseaseSymptom entities related to any of the specified symptoms.
     * Returns an empty list if no matching DiseaseSymptom entities are found.
     */
    List<DiseaseSymptom> findByIdSymptomIdIn(List<String> symptomIds);
    
    /**
     * Finds a list of diseases and their corresponding match counts based on a list of symptom IDs.
     * This query selects the disease and the count of matched symptoms from the DiseaseSymptom table,
     * where the symptom ID is in the provided list.
     * The results are grouped by disease and ordered by match count in descending order.
     *
     * @param symptomIds A list of symptom IDs to search for.
     * @return A list of Object arrays, where each array contains:
     * - The Disease entity.
     * - The count of matched symptoms (as a Long).
     * The list is ordered by match count in descending order.
     * Returns an empty list if no diseases match the given symptom IDs.
     *
     * Example:
     * If symptomIds contains ["symptom1", "symptom2"], this method will return a list of diseases
     * and their respective match counts for these symptoms, sorted by the number of matches.
     */
    @Query("SELECT new com.prediction.backend.dto.DiseaseMatchDTO(ds.id.diseaseId, COUNT(ds.id.symptomId)) " +
    	       "FROM DiseaseSymptom ds " +
    	       "WHERE ds.id.symptomId IN :symptomIds " +
    	       "GROUP BY ds.id.diseaseId " +
    	       "ORDER BY COUNT(ds.id.symptomId) DESC")
    List<DiseaseMatchDTO> findDiseasesBySymptoms(@Param("symptomIds") List<String> symptomIds);
    /*
     * Retrieves a list of disease IDs and the count of matching symptoms for diseases that have all the specified symptoms.
     * <p>This method queries the `DiseaseSymptom` entity to find diseases that are associated with all the symptoms provided in the {@code symptomIds} list.
     * It groups the results by disease ID and filters them to include only diseases where the count of distinct matching symptoms
     * equals the total number of symptoms provided.</p>
     *
     * @param symptomIds A list of symptom IDs to match against diseases.
     * @param symptomCount The expected count of matching symptoms, which should be equal to the size of the {@code symptomIds} list.
     * @return A list of {@code Object[]} where each array contains the disease ID (String) at index 0 and the count of matching symptoms (Long) at index 1.
     * Returns an empty list if no diseases match all the provided symptoms.
     *
     *  */
    @Query("SELECT ds.id.diseaseId, COUNT(DISTINCT ds.id.symptomId) " +
    	       "FROM DiseaseSymptom ds " +
    	       "WHERE ds.id.symptomId IN :symptomIds " +
    	       "GROUP BY ds.id.diseaseId " +
    	       "HAVING COUNT(DISTINCT ds.id.symptomId) = :symptomCount")
    List<Object[]> findDiseasesWithAllSymptoms(@Param("symptomIds") List<String> symptomIds, 
    	                                           @Param("symptomCount") long symptomCount);

}
