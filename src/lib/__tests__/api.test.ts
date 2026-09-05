import { describe, it, expect } from 'vitest'
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } from '../api'

describe('API Functions', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('fetchNotifications', () => {
    it('fetches notifications successfully', async () => {
      const mockData = [
        { id: '1', title: 'Test', message: 'Message', read: false, created_at: '2026-01-01' }
      ]
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetchNotifications('user123')
      
      expect(result).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications?user_id=user123')
      )
    })

    it('handles fetch error', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchNotifications('user123')).rejects.toThrow('Network error')
    })
  })

  describe('fetchUnreadCount', () => {
    it('fetches unread count', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 5 }),
      })

      const count = await fetchUnreadCount('user123')
      
      expect(count).toBe(5)
    })
  })

  describe('markAsRead', () => {
    it('marks notification as read', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await markAsRead('notif123')
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/notif123/read'),
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })

  describe('markAllAsRead', () => {
    it('marks all notifications as read', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await markAllAsRead('user123')
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/read-all?user_id=user123'),
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })
})
