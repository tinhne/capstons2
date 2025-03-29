package com.prediction.backend.services;

import java.util.List;
import com.prediction.backend.dto.request.PermissionRequest;
import com.prediction.backend.dto.response.PermissionResponse;


public interface PermissionService {
    PermissionResponse create(PermissionRequest request);
    List<PermissionResponse> getAllPermissions();
    void deletePermission(String permission);
}