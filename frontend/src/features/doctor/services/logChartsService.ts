import apiClient from "../../../utils/apiClient";

export const fetchDiseaseByLocationStats = async () => {
  const response = await apiClient.get("/stats/disease-by-location");
  console.log("fetchDiseaseByLocationStats", response);
  return response.data || [];
};
export const fetchDemographicData = async () => {
  const response = await apiClient.get("/chart-data");
  console.log("fetchDemographicData", response);
  return response.data;
};
