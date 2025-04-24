package com.prediction.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.prediction.backend.dto.request.UserCreateRequest;
import com.prediction.backend.dto.request.UserUpdateRequest;
import com.prediction.backend.dto.response.UserResponse;
import com.prediction.backend.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest userRequest);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User updatedUser, UserUpdateRequest userRequest);

    UserResponse toUserResponse(User user);
}