import { AxiosError } from "axios";
import { DEFAULT_ERROR_MESSAGES } from "../constants/apiConstants";

/**
 * Interface định nghĩa cấu trúc lỗi từ API
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Interface mô tả cấu trúc lỗi từ API
 */
interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Interface mô tả lỗi đã được xử lý
 */
export interface ProcessedError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
  isNetworkError?: boolean;
  isAuthError?: boolean;
}

/**
 * Kiểm tra xem lỗi có phải là lỗi xác thực (401) hay không
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

/**
 * Kiểm tra xem lỗi có phải là lỗi không có quyền (403) hay không
 */
export function isForbiddenError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}

/**
 * Kiểm tra xem lỗi có phải là lỗi mạng hay không
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.code === "ECONNABORTED" || !error.response;
  }
  return false;
}

/**
 * Lấy thông báo lỗi từ phản hồi API
 */
function getErrorMessageFromResponse(
  error: AxiosError<ApiErrorResponse>
): string {
  // Nếu API trả về message cụ thể, sử dụng nó
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Xử lý theo mã lỗi HTTP
  switch (error.response?.status) {
    case 400:
      return "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
    case 401:
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    case 403:
      return "Bạn không có quyền thực hiện thao tác này.";
    case 404:
      return "Không tìm thấy tài nguyên yêu cầu.";
    case 422:
      return "Dữ liệu không hợp lệ.";
    case 500:
      return "Đã xảy ra lỗi từ máy chủ. Vui lòng thử lại sau.";
    default:
      return `Đã xảy ra lỗi (${
        error.response?.status || "unknown"
      }). Vui lòng thử lại.`;
  }
}

/**
 * Xử lý lỗi API và trả về thông tin lỗi đã chuẩn hóa
 */
export function handleApiError(error: unknown): ProcessedError {
  // Mặc định lỗi nếu không xử lý được
  const defaultError: ProcessedError = {
    message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
  };

  // Nếu không phải là đối tượng error
  if (!error) {
    return defaultError;
  }

  // Xử lý lỗi Axios
  if (error instanceof AxiosError) {
    const isNetwork = isNetworkError(error);

    // Nếu là lỗi mạng
    if (isNetwork) {
      return {
        message:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        isNetworkError: true,
      };
    }

    // Lấy thông tin lỗi từ response
    if (error.response) {
      const status = error.response.status;
      const message = getErrorMessageFromResponse(
        error as AxiosError<ApiErrorResponse>
      );
      const fieldErrors = error.response.data?.errors;

      return {
        message,
        status,
        fieldErrors,
        isAuthError: status === 401,
      };
    }
  }

  // Nếu là Error object thông thường
  if (error instanceof Error) {
    return {
      message: error.message || defaultError.message,
    };
  }

  // Nếu error là string
  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return defaultError;
}

/**
 * Trích xuất thông báo lỗi từ lỗi API để hiển thị cho người dùng
 */
export function extractErrorMessage(error: unknown): string {
  return handleApiError(error).message;
}

/**
 * Trích xuất lỗi trường dữ liệu từ phản hồi API
 */
export function extractFieldErrors(
  error: unknown
): Record<string, string[]> | undefined {
  const processedError = handleApiError(error);
  return processedError.fieldErrors;
}

/**
 * Lấy thông báo lỗi đầu tiên cho một trường cụ thể
 */
export function getFirstFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  fieldName: string
): string | undefined {
  if (
    !fieldErrors ||
    !fieldErrors[fieldName] ||
    !fieldErrors[fieldName].length
  ) {
    return undefined;
  }

  return fieldErrors[fieldName][0];
}

/**
 * Lấy thông báo lỗi mặc định dựa trên mã trạng thái HTTP
 * @param status Mã trạng thái HTTP
 * @returns Thông báo lỗi mặc định
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return DEFAULT_ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return DEFAULT_ERROR_MESSAGES.AUTHENTICATION_ERROR;
    case 403:
      return DEFAULT_ERROR_MESSAGES.AUTHORIZATION_ERROR;
    case 404:
      return DEFAULT_ERROR_MESSAGES.RESOURCE_NOT_FOUND;
    case 500:
    default:
      return DEFAULT_ERROR_MESSAGES.SERVER_ERROR;
  }
}

/**
 * Định dạng các lỗi validation từ server
 * @param errors Đối tượng lỗi validation
 * @returns Danh sách các thông báo lỗi được định dạng
 */
function formatValidationErrors(errors: Record<string, string[]>): string[] {
  const formattedErrors: string[] = [];

  Object.entries(errors).forEach(([field, messages]) => {
    messages.forEach((message) => {
      formattedErrors.push(`${field}: ${message}`);
    });
  });

  return formattedErrors;
}

/**
 * Hiển thị thông báo lỗi cho người dùng
 * @param error Đối tượng lỗi
 */
export function showErrorToast(error: unknown) {
  const processedError = handleApiError(error);

  // Implement hiển thị toast notification tại đây
  console.error("Error:", processedError.message);

  // Nếu có chi tiết lỗi, ghi log chúng
  if (processedError.fieldErrors) {
    Object.entries(processedError.fieldErrors).forEach(([field, messages]) => {
      messages.forEach((message) => console.error(`${field}: ${message}`));
    });
  }
}
