package com.prediction.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.prediction.backend.dto.request.RoleRequest;
import com.prediction.backend.dto.response.RoleResponse;
import com.prediction.backend.models.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    
    RoleResponse toRoleResponse(Role role);
}