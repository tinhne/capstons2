package com.prediction.backend.config;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.SignatureException;

import javax.crypto.spec.SecretKeySpec;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${jwt.signerKey}")
    private String SIGNING_KEY;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            // Log thông tin token để debug
            log.info("Decoding token: {}...", token.substring(0, Math.min(token.length(), 20)));
            log.info("Using signing key: {}...", SIGNING_KEY.substring(0, Math.min(SIGNING_KEY.length(), 10)));

            // Kiểm tra định dạng cơ bản của JWT
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                log.error("Invalid token format: Token must have 3 parts");
                throw new JwtException("Token không đúng định dạng JWT");
            }

            try {
                // Sử dụng JJWT để xác thực token trước
                JwtParser parser = Jwts.parserBuilder()
                        .setSigningKey(SIGNING_KEY.getBytes())
                        .build();

                Claims claims = parser.parseClaimsJws(token).getBody();
                log.info("Token successfully parsed with JJWT. Subject: {}", claims.getSubject());

                // Xử lý JWT bằng Spring Security
                byte[] keyBytes = SIGNING_KEY.getBytes();
                SecretKeySpec key = new SecretKeySpec(keyBytes, "HS256");

                // Giải mã header và payload để kiểm tra
                String header = new String(Base64.getUrlDecoder().decode(parts[0]));
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

                log.info("JWT Header: {}", header);
                log.info("JWT Payload: {}", payload);

                // Tạo JWT thủ công từ thông tin đã giải mã
                long issuedAt = System.currentTimeMillis() / 1000;
                long expiresAt = issuedAt + 3600; // 1 hour

                Jwt.Builder builder = Jwt.withTokenValue(token)
                        .header("alg", "HS256")
                        .header("typ", "JWT")
                        .subject(claims.getSubject())
                        .claim("scope", claims.get("scope", String.class))
                        .issuedAt(claims.getIssuedAt().toInstant())
                        .expiresAt(claims.getExpiration().toInstant());

                // Thêm tất cả các claim khácer
                claims.forEach((key1, value) -> {
                    if (!key1.equals("sub") && !key1.equals("exp") && !key1.equals("iat")) {
                        builder.claim(key1, value);
                    }
                });

                return builder.build();
            } catch (ExpiredJwtException e) {
                log.error("Token đã hết hạn: {}", e.getMessage());
                throw new JwtException("Token đã hết hạn");
            } catch (UnsupportedJwtException e) {
                log.error("Token không được hỗ trợ: {}", e.getMessage());
                throw new JwtException("Token không được hỗ trợ");
            } catch (MalformedJwtException e) {
                log.error("Token định dạng không đúng: {}", e.getMessage());
                throw new JwtException("Token định dạng không đúng");
            } catch (SignatureException e) {
                log.error("Lỗi chữ ký token: {}", e.getMessage());
                throw new JwtException("Lỗi chữ ký token - Khóa bí mật không khớp");
            } catch (IllegalArgumentException e) {
                log.error("Token argument không hợp lệ: {}", e.getMessage());
                throw new JwtException("Token argument không hợp lệ");
            }
        } catch (Exception e) {
            log.error("Lỗi không xác định khi xử lý token: {}", e.getMessage(), e);
            throw new JwtException("Token invalid: " + e.getMessage());
        }
    }
}
