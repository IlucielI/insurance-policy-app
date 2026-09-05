'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Payment {
  id: string
  policy_number: string
  policy_name: string
  amount: number
  due_date: string
  payment_date?: string
  status: 'pending' | 'paid' | 'overdue' | 'failed'
  payment_method?: string
  invoice_url?: string
}

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'bank_transfer' | 'e_wallet'
  name: string
  details: string
  is_default: boolean
}

function BillingContent() {
  const searchParams = useSearchParams()
  const preselectedPolicyId = searchParams.get('policy_id')
  const orderId = searchParams.get('order_id')
  const paymentParam = searchParams.get('payment')

  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [autoPayEnabled, setAutoPayEnabled] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | null>(null)
  const [verifiedPayment, setVerifiedPayment] = useState<any>(null)

  useEffect(() => {
    // SECURITY FIX: Verify payment from backend DB, not URL params
    if (orderId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/verify/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Verification failed')
          return res.json()
        })
        .then(data => {
          setVerifiedPayment(data)
          // Set status based on REAL DB data, not URL params
          setPaymentStatus(
            data.status === 'paid' ? 'success' :
            data.status === 'pending' ? 'pending' : 'failed'
          )
        })
        .catch(() => {
          setPaymentStatus('failed')
        })
    }
    
    fetchPayments()
    fetchPaymentMethods()
  }, [])

  const fetchPayments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const res = await fetch(`${apiUrl}/payments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      setPayments(data.data || [])
    } catch (err) {
      console.error('Failed to fetch payments:', err)
      // Mock data
      setPayments([
        {
          id: '1',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          amount: 2750000,
          due_date: '2027-01-15',
          status: 'pending'
        },
        {
          id: '2',
          policy_number: 'POL-2026-001567',
          policy_name: 'Asuransi Kesehatan Plus',
          amount: 600000,
          due_date: '2027-03-01',
          status: 'pending'
        },
        {
          id: '3',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          amount: 2750000,
          due_date: '2026-01-15',
          payment_date: '2026-01-10',
          status: 'paid',
          payment_method: 'Transfer Bank BCA'
        },
        {
          id: '4',
          policy_number: 'POL-2026-001567',
          policy_name: 'Asuransi Kesehatan Plus',
          amount: 600000,
          due_date: '2026-03-01',
          payment_date: '2026-02-28',
          status: 'paid',
          payment_method: 'Kartu Kredit VISA'
        },
        {
          id: '5',
          policy_number: 'POL-2025-009876',
          policy_name: 'Asuransi Kendaraan Comprehensive',
          amount: 18600000,
          due_date: '2026-06-10',
          status: 'overdue'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const res = await fetch(`${apiUrl}/payment-methods`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      setPaymentMethods(data.data || [])
    } catch (err) {
      console.error('Failed to fetch payment methods:', err)
      // Mock data
      setPaymentMethods([
        { id: '1', type: 'credit_card', name: 'VISA', details: '**** **** **** 1234', is_default: true },
        { id: '2', type: 'bank_transfer', name: 'BCA', details: '1234567890', is_default: false },
        { id: '3', type: 'e_wallet', name: 'GoPay', details: '0812-3456-7890', is_default: false }
      ])
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      failed: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Belum Bayar',
      paid: 'Lunas',
      overdue: 'Terlambat',
      failed: 'Gagal'
    }
    return labels[status] || status
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handlePayment = async (payment: Payment) => {
    setSelectedPayment(payment)
    
    try {
      // Call backend to create Midtrans transaction
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const res = await fetch(`${apiUrl}/billing/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice_id: payment.id })
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }
      
      const data = await res.json()
      
      // Load Midtrans Snap and open payment popup
      const { openSnapPayment } = await import('@/lib/midtrans')
      
      await openSnapPayment({
        token: data.snap_token,
        onSuccess: (result) => {
          console.log('Payment success:', result)
          alert('Pembayaran berhasil! Status: ' + result.transaction_status)
          fetchPayments()
        },
        onPending: (result) => {
          console.log('Payment pending:', result)
          alert('Pembayaran menunggu konfirmasi. Order ID: ' + result.order_id)
          fetchPayments()
        },
        onError: (result) => {
          console.error('Payment error:', result)
          alert('Pembayaran gagal: ' + result.status_message)
        },
        onClose: () => {
          console.log('Payment popup closed')
        }
      })
      
    } catch (err) {
      console.error('Failed to create payment:', err)
      alert('Gagal membuat transaksi: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const processPayment = async () => {
    // Legacy modal payment - kept for fallback
    if (!selectedPayment) return
    alert('Use direct payment button instead')
    setShowPaymentModal(false)
  }

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return p.status === 'pending' || p.status === 'overdue'
    return p.status === filter
  })

  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Insurance</Link>
          <nav className="flex gap-6">
            <Link href="/policies" className="text-gray-700 hover:text-blue-600 font-medium">Polis Saya</Link>
            <Link href="/claims" className="text-gray-700 hover:text-blue-600 font-medium">Klaim</Link>
            <Link href="/billing" className="text-blue-600 font-medium">Tagihan</Link>
            <Link href="/documents" className="text-gray-700 hover:text-blue-600 font-medium">Dokumen</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tagihan & Pembayaran</h1>
          <p className="text-gray-600">Kelola pembayaran premi dan riwayat transaksi Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Tagihan Aktif</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Tagihan Tertunda</p>
            <p className="text-3xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Terlambat</p>
            <p className="text-3xl font-bold text-red-600">
              {payments.filter(p => p.status === 'overdue').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Dibayar (2026)</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                payments
                  .filter(p => p.status === 'paid' && p.payment_date?.startsWith('2026'))
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auto-Pay Card */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">💳 Auto-Pay</h3>
                  <p className="text-purple-100 text-sm">
                    {autoPayEnabled 
                      ? 'Pembayaran otomatis aktif untuk semua polis'
                      : 'Aktifkan pembayaran otomatis agar tidak terlambat'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    autoPayEnabled 
                      ? 'bg-white text-purple-600 hover:bg-purple-50'
                      : 'bg-purple-700 hover:bg-purple-600'
                  }`}
                >
                  {autoPayEnabled ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'upcoming', label: 'Akan Datang' },
                { key: 'paid', label: 'Lunas' },
                { key: 'overdue', label: 'Terlambat' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Payments List */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Memuat tagihan...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-6xl mb-4">💰</div>
                <p className="text-gray-600">Tidak ada tagihan ditemukan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map(payment => (
                  <div
                    key={payment.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left - Payment Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                          {payment.status === 'pending' && getDaysUntilDue(payment.due_date) <= 7 && (
                            <span className="text-xs bg-orange-100 text-orange-700 font-medium px-3 py-1 rounded-full">
                              ⚠️ {getDaysUntilDue(payment.due_date)} hari lagi
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold mb-1">{payment.policy_name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          No. Polis: <span className="font-medium text-gray-900">{payment.policy_number}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Jumlah</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              {payment.status === 'paid' ? 'Tanggal Bayar' : 'Jatuh Tempo'}
                            </p>
                            <p className="font-medium text-gray-900">
                              {formatDate(payment.status === 'paid' && payment.payment_date ? payment.payment_date : payment.due_date)}
                            </p>
                          </div>
                          {payment.payment_method && (
                            <div>
                              <p className="text-gray-600">Metode Pembayaran</p>
                              <p className="font-medium text-gray-900">{payment.payment_method}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right - Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        {(payment.status === 'pending' || payment.status === 'overdue') && (
                          <button
                            onClick={() => handlePayment(payment)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Bayar Sekarang
                          </button>
                        )}
                        {payment.invoice_url && (
                          <a
                            href={payment.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-center"
                          >
                            Invoice
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Payment Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Metode Pembayaran</h3>
              
              <div className="space-y-3 mb-4">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 ${
                      method.is_default ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{method.name}</p>
                      {method.is_default && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.details}</p>
                  </div>
                ))}
              </div>

              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                + Tambah Metode Baru
              </button>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Perlu Bantuan?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Hubungi customer service untuk bantuan pembayaran
              </p>
              <Link
                href="/chat"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
              >
                Chat Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Konfirmasi Pembayaran</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Polis:</span>
                <span className="font-medium">{selectedPayment.policy_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah:</span>
                <span className="font-bold text-blue-600 text-xl">{formatCurrency(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode:</span>
                <span className="font-medium">
                  {paymentMethods.find(pm => pm.is_default)?.name} {paymentMethods.find(pm => pm.is_default)?.details}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                Pembayaran akan diproses segera. Konfirmasi akan dikirim via email.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={processPayment}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}
