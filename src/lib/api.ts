const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export const WS_URL = (API_BASE.startsWith("https") ? "wss" : "ws") + "://" + 
  API_BASE.replace(/https?:\/\//, "").replace(/\/api\/v1/, "") + "/api/v1/notifications/ws"

export interface Notification {
  id: string
  user_id: string
  type: "policy_approved" | "claim_updated" | "payment_confirmed"
  title: string
  message: string
  reference_id?: string
  reference_type?: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export async function fetchNotifications(userId: string, limit = 20, offset = 0): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications?user_id=${userId}&limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error("Gagal mengambil notifikasi")
  const data = await res.json()
  return data.notifications || []
}

export async function fetchUnreadCount(userId: string): Promise<number> {
  const res = await fetch(`${API_BASE}/notifications/unread-count?user_id=${userId}`)
  if (!res.ok) return 0
  const data = await res.json()
  return data.unread_count || 0
}

export async function markAsRead(notificationId: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/${notificationId}/read`, { method: "PUT" })
}

export async function markAllAsRead(userId: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/read-all?user_id=${userId}`, { method: "PUT" })
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/${notificationId}`, { method: "DELETE" })
}
