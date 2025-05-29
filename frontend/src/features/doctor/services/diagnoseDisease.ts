import apiClient from "../../../utils/apiClient";
import { Disease } from "../types";

export async function fetchLogByNotificationId(id: string) {
  const res = await apiClient.get(`/patient-cases/by-notification/${id}`);
  return res.data;
}

export async function updateDiagnoseDisease(payload: {
  id: number;
  riskFactors: string[];
  symptoms: string[];
  predicted_disease: string;
}) {
  return apiClient.put("/diagnose_disease", payload);
}
export async function fetchDiagnosisLogs(userId: string) {
  const res = await apiClient.get(`/diagnose/${userId}`);
  console.log("fetchDiagoisLog", res.data);
  return res.data; // trả về mảng log
}
