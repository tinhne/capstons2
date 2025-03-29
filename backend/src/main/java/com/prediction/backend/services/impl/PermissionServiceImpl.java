package com.prediction.backend.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prediction.backend.dto.request.PermissionRequest;
import com.prediction.backend.dto.response.PermissionResponse;
import com.prediction.backend.mapper.PermissionMapper;
import com.prediction.backend.models.Permission;
import com.prediction.backend.repositories.PermissionRepository;
import com.prediction.backend.services.PermissionService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl implements PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    @Override
    public PermissionResponse create(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }
    @Override
    public List<PermissionResponse> getAllPermissions(){
        return permissionRepository.findAll().stream()
            .map(permissionMapper::toPermissionResponse).toList();
    }
    @Override
    public void deletePermission(String permission){
        permissionRepository.deleteById(permission);
    }
}
