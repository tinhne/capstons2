package com.prediction.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.UserResponse;
import com.prediction.backend.models.User;
import com.prediction.backend.services.UserService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("api/users")
@Slf4j
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public ApiResponse<List<UserResponse>> getAllUsers() {
		return ApiResponse.<List<UserResponse>>builder()
				.data(userService.getAllUsers())
				.build();
	}

	// Get My Info
	@GetMapping("/me")
	public ApiResponse<UserResponse> getMyInfo() {
		return ApiResponse.<UserResponse>builder()
				.data(userService.getMyInfo())
				.build();
	}

	// Get User by Id
	@GetMapping("/{id}")
	public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
		return ApiResponse.<UserResponse>builder()
				.data(userService.getUserById(id))
				.build();
	}

	// Get User by email
	@GetMapping("email/{email}")
	public ApiResponse<UserResponse> getUserByEmail(@PathVariable String email) {
		return ApiResponse.<UserResponse>builder()
				.data(userService.getUserByEmail(email))
				.build();
	}

	// Create User
	@PostMapping
	public ApiResponse<UserResponse> createUser(@RequestBody UserCreateRequest user) {
		return ApiResponse.<UserResponse>builder()
				.data(userService.createUser(user))
				.build();
	}

	// Update User
	@PutMapping("/{id}")
	public ApiResponse<UserResponse> updateUser(@PathVariable String id, @RequestBody UserUpdateRequest user) {
		UserResponse updateResponse = userService.updateUser(id, user);
		return ApiResponse.<UserResponse>builder()
				.data(updateResponse)
				.message("Successfully updated " + updateResponse.getName())
				.build();
	}

	// Delete User
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(ApiResponse.<Void>builder().build());
	}

	@GetMapping("/doctors")
	public ApiResponse<List<User>> getAllDoctors() {
		List<User> doctors = userService.findAllByRole("DOCTOR");
		return ApiResponse.<List<User>>builder()
				.status(1000)
				.message("Successfully retrieved all doctors")
				.data(doctors)
				.build();
	}

	// Create DoctorUser
	@PostMapping("/doctor")
	public ApiResponse<UserResponse> createUserDoctor(@RequestBody UserCreateRequest user) {
		return ApiResponse.<UserResponse>builder()
				.data(userService.createDoctorUser(user))
				.build();
	}

}