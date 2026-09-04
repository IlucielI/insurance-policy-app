'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! 👋 Selamat datang di Layanan Asuransi kami. Saya siap membantu Anda dengan informasi produk, perhitungan premi, proses pendaftaran, dan pertanyaan umum. Ada yang bisa saya bantu?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://insurance-app-api.bayuanugerah.my.id/api/v1'
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || 'Maaf, terjadi kesalahan. Silakan coba lagi.' 
      }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Maaf, tidak dapat terhubung ke server. Pastikan backend sudah berjalan.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Insurance
          </Link>
          <nav className="flex gap-6">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Produk
            </Link>
            <Link href="/chat" className="text-blue-600 font-medium">
              Chat AI
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h2 className="text-xl font-semibold">💬 AI Assistant</h2>
            <p className="text-sm text-blue-100">Tanya apa saja tentang produk asuransi</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kirim
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Tanya tentang produk, premi, cara daftar, atau proses klaim
            </p>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Pertanyaan cepat:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Produk apa saja yang tersedia?',
              'Bagaimana cara menghitung premi?',
              'Proses klaim seperti apa?',
              'Cara mendaftar asuransi'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); setTimeout(sendMessage, 100); }}
                className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
