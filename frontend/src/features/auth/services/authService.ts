import apiClient from "../../../utils/apiClient";
import { LoginResponse, TokenPayload } from "../types";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post(`/api/auth/login`, { email, password });
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  const token = getAuthToken();
  if (token) {
    try {
      await apiClient.post("/api/auth/logout", { token });
    } catch (error) {
      console.error("Error during API logout:", error);
      // Even if API call fails, we still want to clear local token
    }
  }
  removeAuthToken();
};

export const refreshToken = async (token: string) => {
  const res = await apiClient.post("/api/auth/refresh", { token });
  return res.data;
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // Split the token parts
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // The payload is the second part
    const payload = parts[1];

    // Decode the base64 encoded payload
    const decodedPayload = atob(payload);

    // Parse the JSON
    return JSON.parse(decodedPayload) as TokenPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};

export const getAuthHeader = (): { Authorization: string } | undefined => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};
