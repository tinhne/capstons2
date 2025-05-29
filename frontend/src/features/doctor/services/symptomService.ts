import apiClient from "../../../utils/apiClient";
import { Symptom } from "../types";

export const fetchSymptomsPaging = async (page = 0, size = 10) => {
  const response = await apiClient.get(
    `/symptoms/paging?page=${page}&size=${size}`
  );
  return response.data;
};

export const searchSymptomsPaging = async (
  keyword: string,
  page = 0,
  size = 10
) => {
  const response = await apiClient.get(
    `/symptoms/search-paging?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&size=${size}`
  );
  return response.data;
};

export const createSymptom = async (data: Partial<Symptom>) => {
  const response = await apiClient.post("/symptoms", data);
  return response.data;
};

export const updateSymptom = async (id: string, data: Partial<Symptom>) => {
  const response = await apiClient.put(`/symptoms/${id}`, data);
  return response.data;
};

export const deleteSymptom = async (id: string) => {
  await apiClient.delete(`/symptoms/${id}`);
};
