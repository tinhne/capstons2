package com.prediction.backend.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prediction.backend.dto.request.RoleRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.RoleResponse;
import com.prediction.backend.services.RoleService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/role")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        var result = roleService.createRole(request);
        return ApiResponse.<RoleResponse>builder()
                .data(result)
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAllRole() {
        var result = roleService.getAllRoles();
        return ApiResponse.<List<RoleResponse>>builder()
                .data(result)
                .build();
    }

    @DeleteMapping("/{role}")
    ApiResponse<Void> deletePermission(@RequestParam String role) {
        roleService.deleteRole(role);
        return ApiResponse.<Void>builder()
                .build();
    }
    
}