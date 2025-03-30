import { LoginCredentials, LoginResponse } from "../types";
import apiClient from "../../../utils/apiClient";

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse["result"]> => {
  const res = await apiClient.post<LoginResponse>(
    "/api/auth/login",
    credentials
  );
  return res.data.result;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const res = await apiClient.post("/api/auth/refresh");
  return res.data;
};
