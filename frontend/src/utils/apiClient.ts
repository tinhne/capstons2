import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshUserToken } from "../features/auth/redux/authSlice";
import { store } from "../redux/store";

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
      console.log(`Adding auth token to request: ${config.url}`);
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
    // Log successful responses for debugging
    console.log(`API Response [${response.config.url}]:`, response.data);

    // Handle different API response formats
    // Some backends return { data, status, message } format, others return data directly
    if (response.data && typeof response.data === "object") {
      if (response.data.hasOwnProperty("data")) {
        // Return the standard format with status/data/message
        return response.data;
      }
    }

    // Return raw data as-is
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
      return Promise.reject({
        status: error.response.status,
        message: error.response.data || error.message,
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
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      return await this.instance.post<T, T>(url, data, config);
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
    return this.instance.put<T, T>(url, data, config);
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.patch<T, T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete<T, T>(url, config);
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
    return this.instance.post<T, T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
      ...config,
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
