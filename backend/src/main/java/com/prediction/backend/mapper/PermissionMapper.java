package com.prediction.backend.mapper;

import org.mapstruct.Mapper;

import com.prediction.backend.dto.request.PermissionRequest;
import com.prediction.backend.dto.response.PermissionResponse;
import com.prediction.backend.models.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest permissionRequest);
    PermissionResponse toPermissionResponse(Permission permission);
}