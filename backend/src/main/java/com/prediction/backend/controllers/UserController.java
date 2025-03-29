package com.prediction.backend.controllers;

import org.springframework.web.bind.annotation.*;

import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.UserResponse;
import com.prediction.backend.services.UserService;

// import jakarta.validation.Valid;
// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("api/users")
@Slf4j
public class UserController {
	
	private final UserService userService;
	
	public UserController(UserService userService){
		this.userService = userService;
	}
	
	// @GetMapping 
	// public ResponseEntity<List<User>> getAllUsers(){
	// 	List<User> users = userService.getAllUsers();
	// 	return new ResponseEntity<>(users, HttpStatus.OK);
	// }
	@GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
	
		return ApiResponse.<List<UserResponse>>builder()
			.data(userService.getAllUsers())
			.build();
    }
	// Get My Info
	@GetMapping("/myinfo")
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
	public ApiResponse<UserResponse> getUserByEmail(@PathVariable String email){
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
        return ApiResponse.<UserResponse>builder()
			.data(userService.updateUser(id, user))
			.build();
	}

	// Delete User
	@DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(ApiResponse.<Void>builder().build());
    }
}