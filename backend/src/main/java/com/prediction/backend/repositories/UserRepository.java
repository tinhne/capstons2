package com.prediction.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prediction.backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

	// Find user 
	Optional<User> findByEmail(String email);
	
	// Check email if exists
	boolean existsByEmail(String email);
}