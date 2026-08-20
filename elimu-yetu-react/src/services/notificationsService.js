const API_URL = `${import.meta.env.VITE_API_URL}/api/notifications`;

export const fetchNotifications = async (token) => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch notifications");
  return data; // { notifications, unreadCount }
};

export const markAllNotificationsRead = async (token) => {
  const response = await fetch(`${API_URL}/mark-all-read`, {
    method:  "PATCH",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update notifications");
  return data;
};

export const markNotificationRead = async (token, id) => {
  const response = await fetch(`${API_URL}/${id}/read`, {
    method:  "PATCH",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update notification");
  return data;
};