package com.prediction.backend.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002, "Email existed", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_EXISTED(1005, "Email not existed", HttpStatus.NOT_FOUND),
    WRONG_PASSWORD(1006, "Wrong Password", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1007, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(1008, "USER DOES NOT EXIST", HttpStatus.NOT_FOUND),

    // JWT specific error codes
    TOKEN_EXPIRED(1010, "Token expired", HttpStatus.UNAUTHORIZED),
    TOKEN_UNSUPPORTED(1011, "Token not supported", HttpStatus.UNAUTHORIZED),
    TOKEN_MALFORMED(1012, "Malformed token", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID_SIGNATURE(1013, "Token signature error - Secret key mismatch", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID_ARGUMENT(1014, "Invalid token argument", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID(1015, "Invalid token", HttpStatus.UNAUTHORIZED),

    SYMPTOMS_EMPTY(2001, "Danh sách triệu chứng không được để trống", HttpStatus.BAD_REQUEST),
    NO_MATCHING_SYMPTOMS(2002, "Không tìm thấy triệu chứng phù hợp trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    NO_DISEASES_FOUND(2003, "Không tìm thấy bệnh nào phù hợp với các triệu chứng đã cung cấp", HttpStatus.NOT_FOUND),
    DIAGNOSIS_PROCESSING_ERROR(2004, "Lỗi xử lý trong quá trình chẩn đoán", HttpStatus.INTERNAL_SERVER_ERROR),

    // Disease specific error codes
    DISEASE_NOT_FOUND(3001, "Không tìm thấy bệnh với ID đã cung cấp", HttpStatus.NOT_FOUND),
    DISEASE_NAME_EN_EXISTED(3002, "Tên tiếng Anh của bệnh đã tồn tại", HttpStatus.BAD_REQUEST),
    DISEASE_NAME_VN_EXISTED(3003, "Tên tiếng Việt của bệnh đã tồn tại", HttpStatus.BAD_REQUEST),
    ORIGINAL_ID_REQUIRED(3004, "ID gốc của bệnh không được để trống", HttpStatus.BAD_REQUEST),
    ORIGINAL_ID_EXISTED(3005, "ID gốc của bệnh đã tồn tại", HttpStatus.BAD_REQUEST),
    NAME_EN_REQUIRED(3006, "Tên tiếng Anh của bệnh không được để trống", HttpStatus.BAD_REQUEST),
    SEVERITY_REQUIRED(3007, "Mức độ nghiêm trọng của bệnh không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_SEVERITY(3008, "Mức độ nghiêm trọng không hợp lệ", HttpStatus.BAD_REQUEST),
    DISEASE_PROCESSING_ERROR(3009, "Lỗi xử lý dữ liệu bệnh", HttpStatus.INTERNAL_SERVER_ERROR),

    // Symptom specific error codes
    SYMPTOM_NOT_FOUND(4001, "Không tìm thấy triệu chứng với ID đã cung cấp", HttpStatus.NOT_FOUND),
    SYMPTOM_NAME_EN_EXISTED(4002, "Tên tiếng Anh của triệu chứng đã tồn tại", HttpStatus.BAD_REQUEST),
    SYMPTOM_NAME_VN_EXISTED(4003, "Tên tiếng Việt của triệu chứng đã tồn tại", HttpStatus.BAD_REQUEST),
    NAME_VN_REQUIRED(4005, "Tên tiếng Việt của triệu chứng không được để trống", HttpStatus.BAD_REQUEST),
    FREQUENCY_REQUIRED(4006, "Tần suất của triệu chứng không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_FREQUENCY_VALUE(4007, "Giá trị tần suất không hợp lệ", HttpStatus.BAD_REQUEST),
    SYMPTOM_PROCESSING_ERROR(4008, "Lỗi xử lý dữ liệu triệu chứng", HttpStatus.INTERNAL_SERVER_ERROR),

    JWT_TOKEN_EMPTY(5001, "JWT token is null or empty", HttpStatus.BAD_REQUEST),
    JWT_TOKEN_INVALID(5002, "JWT token is invalid", HttpStatus.BAD_REQUEST),
    JWT_TOKEN_EXPIRED(5003, "JWT token has expired", HttpStatus.UNAUTHORIZED),
    JWT_TOKEN_PARSE_ERROR(5004, "Error parsing JWT token", HttpStatus.BAD_REQUEST),
    JWT_DECODER_INITIALIZATION_ERROR(5005, "Failed to initialize JWT decoder", HttpStatus.INTERNAL_SERVER_ERROR),
    JWT_INTROSPECTION_ERROR(5006, "Error during token introspection", HttpStatus.INTERNAL_SERVER_ERROR),
    JWT_UNEXPECTED_ERROR(5007, "Unexpected error during JWT processing", HttpStatus.INTERNAL_SERVER_ERROR),

    CONVERSATION_NOT_FOUND(6000, "Conversation not found", HttpStatus.NOT_FOUND),
    USER_NOT_IN_CONVERSATION(6001, "User not in conversation", HttpStatus.NOT_FOUND);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
