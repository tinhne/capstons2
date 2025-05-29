import apiClient from "../../../utils/apiClient";
import { Disease } from "../types";

// Lấy danh sách disease
export const fetchDiseases = async (): Promise<Disease[]> => {
  const response = await apiClient.get("/diseases");
  return response.data;
};

// Lấy chi tiết disease theo id
export const fetchDiseaseById = async (diseaseId: string): Promise<Disease> => {
  const response = await apiClient.get(`/diseases/${diseaseId}`);
  return response.data;
};

// Thêm mới disease
export const createDisease = async (
  data: Partial<Disease>
): Promise<Disease> => {
  const response = await apiClient.post("/diseases", data);
  return response.data;
};

// Cập nhật disease
export const updateDisease = async (
  diseaseId: string,
  data: Partial<Disease>
): Promise<Disease> => {
  const response = await apiClient.put(`/diseases/${diseaseId}`, data);
  return response.data;
};

// Xóa disease
export const deleteDisease = async (diseaseId: string): Promise<void> => {
  await apiClient.delete(`/diseases/${diseaseId}`);
};

export const fetchDiseasesPaging = async (page = 0, size = 10) => {
  const response = await apiClient.get(
    `/diseases/paging?page=${page}&size=${size}`
  );
  return response.data;
};

export const searchDiseases = async (keyword: string): Promise<Disease[]> => {
  const response = await apiClient.get(
    `/diseases/search?keyword=${encodeURIComponent(keyword)}`
  );
  // Lấy đúng mảng data từ response
  return response.data.data;
};

// Tìm kiếm disease có phân trang
export const searchDiseasesPaging = async (keyword: string, page = 0, size = 10) => {
  const response = await apiClient.get(`/diseases/search-paging?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
  return response.data;
};
