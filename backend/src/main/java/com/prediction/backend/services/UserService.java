package com.prediction.backend.services;

import java.util.List;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.UserResponse;

public interface UserService {
	@PreAuthorize("hasRole('ADMIN')")
	List<UserResponse> getAllUsers();
	@PostAuthorize("returnObject.email == authentication.name")
	UserResponse getUserById(String id);
	UserResponse getUserByEmail(String email);

	UserResponse createUser(UserCreateRequest user);

	@PostAuthorize("returnObject.email == authentication.name")
	UserResponse updateUser(String id, UserUpdateRequest user);
	
	@PreAuthorize("hasRole('ADMIN')")
	void deleteUser(String id);

	@PostAuthorize("returnObject.email == authentication.name")
	UserResponse getMyInfo();
}
