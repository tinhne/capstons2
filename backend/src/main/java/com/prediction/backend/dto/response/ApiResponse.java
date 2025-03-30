package com.prediction.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private int status = 1000;
    private String message;
    private T data;
}

// import com.fasterxml.jackson.annotation.JsonFormat;
// import com.fasterxml.jackson.annotation.JsonInclude;
// import jakarta.validation.constraints.NotNull;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// import lombok.AccessLevel;
// import lombok.AllArgsConstructor;
// import lombok.experimental.FieldDefaults;
// import org.springframework.http.HttpStatus;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.UUID;
// import java.time.OffsetDateTime;
// import java.time.ZoneOffset;

// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// @FieldDefaults(level = AccessLevel.PRIVATE)
// @JsonInclude(JsonInclude.Include.NON_NULL)
// public class ApiResponse<T> {

// @NotNull(message = "Timestamp is required")
// @JsonFormat(shape = JsonFormat.Shape.STRING, pattern =
// "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "UTC")
// @Builder.Default
// private OffsetDateTime timestamp = OffsetDateTime.now(ZoneOffset.UTC);

// @NotNull(message = "Status code is required")
// private int status;

// private String message;

// private T data;

// private ApiError error;

// @NotNull(message = "Request path is required")
// private String path;

// @Builder.Default
// private String apiVersion = "1.0";

// // Constructors
// public ApiResponse(OffsetDateTime timestamp, int status, String message, T
// data, String path) {
// this.timestamp = (timestamp != null) ? timestamp :
// OffsetDateTime.now(ZoneOffset.UTC);
// this.status = status;
// this.message = message;
// this.data = data;
// this.path = path;
// }

// public ApiResponse(OffsetDateTime timestamp, int status, String message, T
// data, ApiError error, String path) {
// this.timestamp = (timestamp != null) ? timestamp :
// OffsetDateTime.now(ZoneOffset.UTC);
// this.status = status;
// this.message = message;
// this.data = data;
// this.error = error;
// this.path = path;
// }

// public ApiResponse(int status, String message, T data, String path) {
// this.timestamp = OffsetDateTime.now(ZoneOffset.UTC);
// this.status = status;
// this.message = message;
// this.data = data;
// this.path = path;
// }

// // Getter of ApiResponse class
// public T getData() { return this.data;}
// public String getMessage() { return this.message;}
// // Nested static class for API errors
// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public static class ApiError {

// public ApiError(String code, String message, List<String> details,
// OffsetDateTime time) {
// this.code = code;
// this.message = message;
// this.details = details;
// this.timestamp = time;
// }
// @NotNull(message = "Error code is required")
// private String code;

// @NotNull(message = "Error message is required")
// private String message;

// @Builder.Default
// private List<String> details = new ArrayList<>();

// @Builder.Default
// private String debugId = UUID.randomUUID().toString();

// private OffsetDateTime timestamp;

// // Getter and setter method
// public String getCode() {
// return code;
// }
// public List<String> getDetails() {
// return details;
// }
// public OffsetDateTime getTimestamp() {
// return timestamp;
// }
// }

// // Static factory methods for common responses
// public static <T> ApiResponse<T> success(T data, String path) {
// return new ApiResponse<>(OffsetDateTime.now(ZoneOffset.UTC),
// HttpStatus.OK.value(), "Success", data, path);
// }

// public static <T> ApiResponse<T> created(T data, String path) {
// return new ApiResponse<>(OffsetDateTime.now(ZoneOffset.UTC),
// HttpStatus.CREATED.value(), "Created", data, path);
// }

// public static <T> ApiResponse<T> error(HttpStatus status, String code, String
// message, String path) {
// ApiError error = new ApiError(code, message, new ArrayList<>(),
// OffsetDateTime.now(ZoneOffset.UTC));
// return new ApiResponse<>(OffsetDateTime.now(ZoneOffset.UTC), status.value(),
// "Error", null, error, path);
// }

// public static <T> ApiResponse<T> validationError(List<String> details, String
// path) {
// ApiError error = new ApiError("VALIDATION_ERROR", "Validation failed",
// details, OffsetDateTime.now(ZoneOffset.UTC));
// return new ApiResponse<>(OffsetDateTime.now(ZoneOffset.UTC),
// HttpStatus.BAD_REQUEST.value(), "Validation Error", null, error, path);
// }

// // Helper methods
// public boolean isSuccess() {
// return status >= 200 && status < 300;
// }

// public boolean hasError() {
// return error != null;
// }

// public boolean isError() {
// return HttpStatus.valueOf(status).isError();
// }

// public boolean hasValidationErrors() {
// return error != null && "VALIDATION_ERROR".equals(error.getCode());
// }

// public List<String> getErrorDetails() {
// return error != null ? error.getDetails() : new ArrayList<>();
// }

// public String getErrorCode() {
// return error != null ? error.getCode() : null;
// }
// }
