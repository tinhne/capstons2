import method from "../../../utils/apiClient";

export const sendMessage = async (message: string) => {
  const response = await method.post("/chat/send", { message });
  return response.data;
};
