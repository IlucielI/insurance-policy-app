"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Notification, WS_URL } from "@/lib/api"

export function useWebSocket(userId: string | null) {
  const [lastNotification, setLastNotification] = useState<Notification | null>(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!userId) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const url = `${WS_URL}?user_id=${userId}`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data)
        setLastNotification(notification)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      setConnected(false)
      // Reconnect after 3s
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [userId])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [connect])

  const clearNotification = useCallback(() => {
    setLastNotification(null)
  }, [])

  return { lastNotification, connected, clearNotification }
}
