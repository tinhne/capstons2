package com.prediction.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;
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

    /**
     * Create a successful response with data
     * 
     * @param data The data to include in the response
     * @return A success response with status 1000
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status(1000)
                .message("Success")
                .data(data)
                .build();
    }

    /**
     * Create a success response with custom message and data
     * 
     * @param message Custom message
     * @param data    The data to include in the response
     * @return A success response with status 1000
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .status(1000)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Create an error response
     * 
     * @param status  Error status code
     * @param message Error message
     * @return An error response without data
     */
    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .build();
    }
}