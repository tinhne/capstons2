package com.prediction.backend.services;

import java.util.List;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.UserResponse;
import com.prediction.backend.models.User;

public interface UserService {
	@PreAuthorize("hasRole('ADMIN')")
	List<UserResponse> getAllUsers();

	UserResponse getUserById(String id);

	UserResponse getUserByEmail(String email);

	UserResponse createUser(UserCreateRequest user);

	@PreAuthorize("hasRole('ADMIN') or #id == authentication.name")
	UserResponse updateUser(String id, UserUpdateRequest user);

	@PreAuthorize("hasRole('ADMIN')")
	void deleteUser(String id);

	@PostAuthorize("returnObject.id == authentication.name")
	UserResponse getMyInfo();

	/**
	 * Find all users by role
	 * 
	 * @param role Role name to filter by
	 * @return List of users with the specified role
	 */
	List<User> findAllByRole(String role);

	@PreAuthorize("hasRole('ADMIN')")
	UserResponse createDoctorUser(UserCreateRequest user);
}
