import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notificationsServices";
import { Notification } from "../types";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchNotifications(userId)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [userId]);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return { notifications, loading, markAsRead };
}
export function useNotificationSocket(
  userId: string,
  onNotification: (n: Notification) => void
) {
  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: undefined,
      webSocketFactory: () => new SockJS("/ws"),
      onConnect: () => {
        // Đăng ký cả hai topic nếu muốn nhận cả hai loại thông báo
        client.subscribe(`/${userId}/queue/notifications`, (message) => {
          const notification: Notification = JSON.parse(message.body);
          console.log("Received notification user:", notification); // ✅ Debug log

          onNotification(notification);
        });
        // Nếu vẫn muốn nhận thông báo từ topic cũ cho bác sĩ
        client.subscribe(`/topic/doctor-notifications/${userId}`, (message) => {
          const notification: Notification = JSON.parse(message.body);
          console.log("Received notification doctor:", notification); // ✅ Debug log

          onNotification(notification);
        });
      },
    });
    client.activate();

    return () => {
      // client.deactivate();
    };
  }, [userId, onNotification]);
}
