package com.prediction.backend.controllers;

import java.text.ParseException;
import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;
import com.prediction.backend.dto.request.AuthenticationRequest;
import com.prediction.backend.dto.request.IntrospectRequest;
import com.prediction.backend.dto.request.LogoutRequest;
import com.prediction.backend.dto.request.RefeshTokenRequest;
import com.prediction.backend.dto.response.ApiResponse;
import com.prediction.backend.dto.response.AuthenticationResponse;
import com.prediction.backend.dto.response.IntrospectResponse;
import com.prediction.backend.services.AuthenticationService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.success("Login successful", result);
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.success(result);
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest token) throws ParseException, JOSEException {
        authenticationService.logout(token);
        return ApiResponse.success("Logout successful", null);
    }

    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefeshTokenRequest token)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(token);
        return ApiResponse.success("Token refreshed", result);
    }
}
