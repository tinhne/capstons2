package com.prediction.backend.services;

import java.text.ParseException;
import com.nimbusds.jose.JOSEException;
import com.prediction.backend.dto.request.AuthenticationRequest;
import com.prediction.backend.dto.request.IntrospectRequest;
import com.prediction.backend.dto.request.LogoutRequest;
import com.prediction.backend.dto.request.RefeshTokenRequest;
import com.prediction.backend.dto.response.AuthenticationResponse;
import com.prediction.backend.dto.response.IntrospectResponse;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    void logout(LogoutRequest token) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(RefeshTokenRequest refreshToken) throws ParseException, JOSEException;
}