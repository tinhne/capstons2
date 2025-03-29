package com.prediction.backend.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.request.PermissionRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.PermissionResponse;
import com.prediction.backend.services.PermissionService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/permission")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request) {
        var result = permissionService.create(request);
        return ApiResponse.<PermissionResponse>builder()
                .data(result)
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getAllPermissions() {
        var result = permissionService.getAllPermissions();
        return ApiResponse.<List<PermissionResponse>>builder()
                .data(result)
                .build();
    }

    @DeleteMapping("/{permission}")
    ApiResponse<Void> deletePermission(@RequestParam String permission) {
        permissionService.deletePermission(permission);
        return ApiResponse.<Void>builder()
                .build();
    }   
}