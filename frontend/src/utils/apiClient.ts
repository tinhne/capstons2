import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshUserToken } from "../features/auth/redux/authSlice";
import { store } from "../redux/store";
import { useToast } from "../contexts/ToastContext";

// Thêm biến toastHandler để inject từ ngoài vào
let toastHandler:
  | ((message: string, type?: "success" | "error") => void)
  | null = null;

export function setApiToastHandler(handler: typeof toastHandler) {
  toastHandler = handler;
}

/**
 * Thiết lập API client cho toàn bộ ứng dụng
 */
class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: any[] = [];

  constructor() {
    // Tạo instance axios với cấu hình cơ bản
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds
    });

    // Thiết lập interceptor cho request
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Thiết lập interceptor cho response
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  /**
   * Xử lý request trước khi gửi đi
   */
  private handleRequest = (
    config: AxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log(`Adding auth token to request: ${config.url}`);
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config as InternalAxiosRequestConfig;
  };

  /**
   * Xử lý lỗi request
   */
  private handleRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error("Request error:", error);
    return Promise.reject(error);
  };

  /**
   * Xử lý response
   */
  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    // Không gọi toastHandler ở đây nữa
    if (response.data && typeof response.data === "object") {
      if (response.data.hasOwnProperty("data")) {
        return response.data;
      }
    }
    return response.data;
  };

  /**
   * Xử lý lỗi response
   */
  private handleResponseError = async (error: AxiosError): Promise<any> => {
    console.error("API Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      responseData: error.response?.data,
    });

    const originalRequest = error.config;

    // Xử lý lỗi 401 Unauthorized hoặc lỗi xác thực
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      // Nếu đang refresh token thì đưa request vào hàng đợi
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return this.instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      this.isRefreshing = true;

      // Lấy refresh token từ local storage
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Không có refresh token, đăng xuất người dùng
        console.warn("No refresh token available - user should be logged out");
        this.processQueue(null, new Error("No refresh token"));
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Force redirect to login page
        return Promise.reject(error);
      }

      try {
        // Gửi yêu cầu refresh token
        console.log("Attempting to refresh token");
        const result = await store.dispatch(refreshUserToken()).unwrap();
        console.log("Token refresh successful", result);

        const newToken = result.token;

        // Cập nhật Bearer token cho request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Xử lý các request trong hàng đợi
        this.processQueue(newToken, null);

        // Thực hiện lại request ban đầu với token mới
        return this.instance(originalRequest);
      } catch (refreshError) {
        // Xử lý hàng đợi với lỗi
        console.error("Token refresh failed:", refreshError);
        this.processQueue(null, refreshError);

        // Xóa token và đẩy người dùng về trang đăng nhập
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Force redirect to login page

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    // Transform error response to more usable format if possible
    if (error.response?.data) {
      let message: string | undefined = undefined;
      if (
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        message = error.response.data.message;
      } else if (typeof error.response.data === "string") {
        message = error.response.data;
      }
      if (toastHandler && message) {
        toastHandler(message, "error");
      }
      return Promise.reject({
        status: error.response.status,
        message: message || error.message,
        data: error.response.data,
      });
    }

    return Promise.reject(error);
  };

  /**
   * Xử lý hàng đợi các request thất bại
   */
  private processQueue = (token: string | null, error: any): void => {
    this.failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        request.resolve(token);
      }
    });

    this.failedQueue = [];
  };

  /**
   * GET request
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      return await this.instance.get<T, T>(url, config);
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    showToast: boolean = true
  ): Promise<T> {
    try {
      const res = await this.instance.post<T, T>(url, data, config);
      if (
        showToast &&
        toastHandler &&
        res &&
        typeof res === "object" &&
        "message" in res &&
        typeof res.message === "string"
      ) {
        toastHandler(res.message, "success");
      }
      return res;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.put<T, T>(url, data, config);
    if (
      toastHandler &&
      res &&
      typeof res === "object" &&
      "message" in res &&
      typeof res.message === "string"
    ) {
      toastHandler(res.message, "success");
    }
    return res;
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.patch<T, T>(url, data, config);
    if (
      toastHandler &&
      res &&
      typeof res === "object" &&
      "message" in res &&
      typeof res.message === "string"
    ) {
      toastHandler(res.message, "success");
    }
    return res;
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.delete<T, T>(url, config);
    if (
      toastHandler &&
      res &&
      typeof res === "object" &&
      "message" in res &&
      typeof res.message === "string"
    ) {
      toastHandler(res.message, "success");
    }
    return res;
  }

  /**
   * Upload file
   */
  public async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.post<T, T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
      ...config,
    });
    if (
      toastHandler &&
      res &&
      typeof res === "object" &&
      "message" in res &&
      typeof res.message === "string"
    ) {
      toastHandler(res.message, "success");
    }
    return res;
  }
}

const apiClient = new ApiClient();
export default apiClient;
