package com.prediction.backend.services;

import java.util.List;
import com.prediction.backend.dto.request.RoleRequest;
import com.prediction.backend.dto.response.RoleResponse;

public interface RoleService {
    RoleResponse createRole(RoleRequest request);
    List<RoleResponse> getAllRoles();
    void deleteRole(String role);
}