package com.prediction.backend.repositories;

import org.springframework.stereotype.Repository;
import com.prediction.backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    
}