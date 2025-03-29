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
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email)));
	}

	@Override
	public UserResponse createUser(UserCreateRequest userRequest) {
		// return userRepository.save(user);
		if (userRepository.existsByEmail(userRequest.getEmail())) {
			throw new RuntimeException("Email already exists");
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
		User updatedUser = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
		userMapper.updateUser(updatedUser, userRequest);
		updatedUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
		var roles = roleRepository.findAllById(userRequest.getRoles());
		updatedUser.setRoles(new HashSet<>(roles));
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
		String email = context.getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
		return userMapper.toUserResponse(user);
	}
}