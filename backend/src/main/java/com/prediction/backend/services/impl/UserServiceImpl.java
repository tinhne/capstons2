package com.prediction.backend.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import lombok.AccessLevel;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prediction.backend.constants.PredefinedRole;
import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.UserResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.mapper.UserMapper;
import com.prediction.backend.models.Role;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.RoleRepository;
import com.prediction.backend.repositories.UserRepository;
import com.prediction.backend.services.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceImpl implements UserService {
	UserRepository userRepository;
	UserMapper userMapper;
	RoleRepository roleRepository;
	PasswordEncoder passwordEncoder;

	@Override
	public List<UserResponse> getAllUsers() {
		log.info("in method getAllUsers");
		return userRepository.findAll().stream()
				.map(userMapper::toUserResponse).toList();
	}

	@Override
	public UserResponse getUserById(String id) {
		return userMapper.toUserResponse(
				userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id)));
	}

	@Override
	public UserResponse getUserByEmail(String email) {
		return userMapper.toUserResponse(userRepository.findByEmail(email)
				.orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED)));
	}

	@Override
	public UserResponse createUser(UserCreateRequest userRequest) {
		// return userRepository.save(user);
		if (userRepository.existsByEmail(userRequest.getEmail())) {
			throw new AppException(ErrorCode.EMAIL_EXISTED);
		}
		User newuser = userMapper.toUser(userRequest);
		newuser.setPassword(passwordEncoder.encode(userRequest.getPassword()));

		HashSet<Role> roles = new HashSet<>();
		roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

		newuser.setRoles(roles);

		return userMapper.toUserResponse(userRepository.save(newuser));
	}

	@Override
	public UserResponse updateUser(String id, UserUpdateRequest userRequest) {
		User updatedUser = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.EMAIL_EXISTED));
		userMapper.updateUser(updatedUser, userRequest);
		// updatedUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
		// var roles = roleRepository.findAllById(userRequest.getRoles());
		// updatedUser.setRoles(new HashSet<>(roles));
		return userMapper.toUserResponse(userRepository.save(updatedUser));
	}

	@Override
	public void deleteUser(String id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
		} else {
			throw new RuntimeException("User not found with id: " + id);
		}
	}

	@Override
	public UserResponse getMyInfo() {
		var context = SecurityContextHolder.getContext();
		String id = context.getAuthentication().getName();
		User user = userRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
		return userMapper.toUserResponse(user);
	}

	@Override
	public List<User> findAllByRole(String roleName) {
		log.info("Finding all users with role: {}", roleName);

		// Find the role entity
		Role role = roleRepository.findById(roleName)
				.orElse(null);

		if (role == null) {
			log.warn("Role not found: {}", roleName);
			return new ArrayList<>();
		}

		// Find all users that have this role
		List<User> allUsers = userRepository.findAll();

		// Filter users by role
		return allUsers.stream()
				.filter(user -> user.getRoles() != null &&
						user.getRoles().stream().anyMatch(r -> r.getName().equals(roleName)))
				.map(this::sanitizeUserForPublic)
				.collect(Collectors.toList());
	}

	/**
	 * Remove sensitive information from user before sending to client
	 */
	private User sanitizeUserForPublic(User user) {
		// Create a copy of the user without the password
		User sanitizedUser = new User();
		sanitizedUser.setId(user.getId());
		sanitizedUser.setName(user.getName());
		sanitizedUser.setEmail(user.getEmail());
		sanitizedUser.setRoles(user.getRoles());
		// Don't set password

		// You can add more fields as needed

		return sanitizedUser;
	}

	// Create user doctor
	@Override
	public UserResponse createDoctorUser(UserCreateRequest userRequest) {
		if (userRepository.existsByEmail(userRequest.getEmail())) {
			throw new AppException(ErrorCode.EMAIL_EXISTED);
		}
		User newUser = userMapper.toUser(userRequest);
		newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));

		HashSet<Role> roles = new HashSet<>();
		// Gán role Doctor
		roleRepository.findById(PredefinedRole.DOCTOR_ROLE).ifPresent(roles::add);

		newUser.setRoles(roles);

		return userMapper.toUserResponse(userRepository.save(newUser));
	}
}