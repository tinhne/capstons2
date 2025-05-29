export interface Notification {
  id: string;
  sender: string;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: "info" | "warning" | "success" | "error";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}
