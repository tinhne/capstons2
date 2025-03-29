package com.prediction.backend.services.impl;

import java.security.Permission;
import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import com.prediction.backend.dto.request.RoleRequest;
import com.prediction.backend.dto.response.RoleResponse;
import com.prediction.backend.mapper.RoleMapper;
import com.prediction.backend.repositories.PermissionRepository;
import com.prediction.backend.repositories.RoleRepository;
import com.prediction.backend.services.RoleService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;
    @Override
    public RoleResponse createRole(RoleRequest request) {
            var role = roleMapper.toRole(request);

            var permissions=permissionRepository.findAllById(request.getPermissions());
            role.setPermissions(new HashSet<>(permissions));

            roleRepository.save(role);
            
            return roleMapper.toRoleResponse(role);
    }
    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(roleMapper::toRoleResponse).toList();
    }

    @Override
    public void deleteRole(String role) {
        roleRepository.deleteById(role);
    }

}