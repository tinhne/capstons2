package com.prediction.backend.config;

import java.text.ParseException;
import java.util.Objects;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.prediction.backend.dto.request.IntrospectRequest;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.services.AuthenticationService;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    private static final Logger logger = LoggerFactory.getLogger(CustomJwtDecoder.class);

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private AuthenticationService authenticationService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @PostConstruct
    public void init() {
        try {
            logger.debug("Initializing JWT decoder with signer key length: {}", signerKey.length());
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS256");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
            logger.info("JWT Decoder initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize JWT Decoder: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.JWT_DECODER_INITIALIZATION_ERROR);
        }
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        if (token == null || token.isEmpty()) {
            logger.error("Token is null or empty");
            throw new AppException(ErrorCode.JWT_TOKEN_EMPTY);
        }

        try {
            // Log token details (but not the full token for security)
            String tokenPreview = token.length() > 10
                    ? token.substring(0, 5) + "..." + token.substring(token.length() - 5)
                    : "too short";
            logger.debug("Processing token: {} (length: {})", tokenPreview, token.length());

            // Validate token through introspection
            logger.debug("Starting token introspection");
            var response = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());
            logger.debug("Introspection completed, token valid: {}", response.isValid());

            if (!response.isValid()) {
                logger.error("Token validation failed: token is invalid");
                throw new AppException(ErrorCode.JWT_TOKEN_INVALID);
            }

            if (Objects.isNull(nimbusJwtDecoder)) {
                logger.warn("NimbusJwtDecoder was null, reinitializing");
                init();
            }

            // Actual token decoding
            logger.debug("Starting NimbusJwtDecoder.decode()");
            Jwt jwt = null;
            try {
                jwt = nimbusJwtDecoder.decode(token);
                logger.debug("JWT successfully decoded - Subject: {}, Issued: {}",
                        jwt.getSubject(), jwt.getIssuedAt());
                return jwt;
            } catch (Exception e) {
                logger.error("NimbusJwtDecoder.decode() failed: {}", e.getMessage(), e);
                throw e;
            }
        } catch (JOSEException | ParseException e) {
            logger.error("Token validation error: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.JWT_TOKEN_PARSE_ERROR);
        } catch (AppException e) {
            // Re-throw our custom exceptions
            logger.error("Application exception during token validation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during token decoding: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.JWT_UNEXPECTED_ERROR);
        }
    }
}