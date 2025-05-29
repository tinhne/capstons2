import apiClient from "../../../utils/apiClient";
import { Notification } from "../types";

export async function fetchNotifications(
  userId: string
): Promise<Notification[]> {
  const res = await apiClient.get<{ data: Notification[] }>(
    `/notifications?userId=${userId}`
  );
  return res.data;
}

export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  const res = await apiClient.post<{ data: Notification }>(
    `/notifications/read/${id}`,
    undefined,
    undefined,
    false // set showToast = false
  );
  return res.data;
}

export async function getNotificationDetail(id: string): Promise<Notification> {
  const res = await apiClient.get<{ data: Notification }>(
    `/notifications/${id}`
  );
  return res.data;
}
