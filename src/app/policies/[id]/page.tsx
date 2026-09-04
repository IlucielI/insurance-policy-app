'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface PolicyDetail {
  id: string
  policy_number: string
  product_name: string
  category: string
  status: 'active' | 'pending' | 'expired' | 'cancelled'
  sum_assured: number
  premium: number
  start_date: string
  end_date: string
  next_payment_date?: string
  holder_name: string
  holder_email: string
  holder_phone: string
  beneficiaries: Array<{
    name: string
    relationship: string
    percentage: number
  }>
  coverage_details: string[]
  exclusions: string[]
  payment_history: Array<{
    date: string
    amount: number
    status: 'paid' | 'pending' | 'failed'
    method: string
  }>
}

export default function PolicyDetailPage() {
  const params = useParams()
  const policyId = params.id as string
  const [policy, setPolicy] = useState<PolicyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'payments' | 'beneficiaries'>('overview')

  useEffect(() => {
    fetchPolicyDetail()
  }, [policyId])

  const fetchPolicyDetail = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setPolicy(data.data)
    } catch (err) {
      console.error('Failed to fetch policy detail:', err)
      // Mock data fallback
      setPolicy({
        id: policyId,
        policy_number: 'POL-2026-001234',
        product_name: 'Asuransi Jiwa Premium',
        category: 'life',
        status: 'active',
        sum_assured: 500000000,
        premium: 2750000,
        start_date: '2026-01-15',
        end_date: '2027-01-15',
        next_payment_date: '2027-01-15',
        holder_name: 'John Doe',
        holder_email: 'john.doe@email.com',
        holder_phone: '+62 812 3456 7890',
        beneficiaries: [
          { name: 'Jane Doe', relationship: 'Istri', percentage: 60 },
          { name: 'Junior Doe', relationship: 'Anak', percentage: 40 }
        ],
        coverage_details: [
          'Santunan meninggal dunia hingga Rp 500 juta',
          'Santunan cacat tetap total hingga Rp 300 juta',
          'Biaya pemakaman hingga Rp 20 juta',
          'Santunan rawat inap akibat kecelakaan Rp 500rb/hari',
          'Double indemnity untuk kecelakaan'
        ],
        exclusions: [
          'Bunuh diri dalam 2 tahun pertama polis',
          'Kegiatan berbahaya (terjun payung, panjat tebing ekstrem)',
          'Perang, terorisme, atau kerusuhan',
          'Penyakit yang sudah ada sebelumnya (pre-existing)',
          'Penggunaan narkoba atau alkohol berlebihan'
        ],
        payment_history: [
          { date: '2026-01-15', amount: 2750000, status: 'paid', method: 'Transfer Bank' },
          { date: '2025-01-15', amount: 2750000, status: 'paid', method: 'Kartu Kredit' },
          { date: '2024-01-15', amount: 2500000, status: 'paid', method: 'Transfer Bank' }
        ]
      })
    } finally {
      setLoading(false)
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
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktif',
      pending: 'Pending',
      expired: 'Kedaluwarsa',
      cancelled: 'Dibatalkan',
      paid: 'Lunas',
      failed: 'Gagal'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat detail polis...</p>
        </div>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">Polis tidak ditemukan</p>
          <Link href="/policies" className="text-blue-600 hover:underline">
            Kembali ke Daftar Polis
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Insurance
          </Link>
          <nav className="flex gap-6">
            <Link href="/policies" className="text-blue-600 font-medium">
              Polis Saya
            </Link>
            <Link href="/claims" className="text-gray-700 hover:text-blue-600 font-medium">
              Klaim
            </Link>
            <Link href="/billing" className="text-gray-700 hover:text-blue-600 font-medium">
              Tagihan
            </Link>
            <Link href="/documents" className="text-gray-700 hover:text-blue-600 font-medium">
              Dokumen
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <Link href="/policies" className="text-blue-600 hover:underline">Polis Saya</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{policy.policy_number}</span>
        </div>

        {/* Policy Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(policy.status)}`}>
                  {getStatusLabel(policy.status)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{policy.product_name}</h1>
              <p className="text-blue-100">No. Polis: {policy.policy_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Jumlah Pertanggungan</p>
              <p className="text-3xl font-bold">{formatCurrency(policy.sum_assured)}</p>
              <p className="text-sm text-blue-100 mt-2">Premi: {formatCurrency(policy.premium)}/tahun</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link
            href={`/claims/new?policy_id=${policy.id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <p className="font-semibold text-gray-900">Ajukan Klaim</p>
              <p className="text-sm text-gray-600">Submit klaim baru</p>
            </div>
          </Link>
          <Link
            href={`/billing?policy_id=${policy.id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <p className="font-semibold text-gray-900">Bayar Premi</p>
              <p className="text-sm text-gray-600">Lihat tagihan & bayar</p>
            </div>
          </Link>
          <Link
            href={`/documents?policy_id=${policy.id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dokumen Polis</p>
              <p className="text-sm text-gray-600">Download & lihat</p>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <div className="flex gap-0 overflow-x-auto">
              {[
                { key: 'overview', label: 'Ringkasan' },
                { key: 'coverage', label: 'Cakupan & Pengecualian' },
                { key: 'beneficiaries', label: 'Ahli Waris' },
                { key: 'payments', label: 'Riwayat Pembayaran' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Polis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pemegang Polis</p>
                      <p className="font-medium text-gray-900">{policy.holder_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium text-gray-900">{policy.holder_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                      <p className="font-medium text-gray-900">{policy.holder_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status Polis</p>
                      <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(policy.status)}`}>
                        {getStatusLabel(policy.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tanggal Mulai</p>
                      <p className="font-medium text-gray-900">{formatDate(policy.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tanggal Berakhir</p>
                      <p className="font-medium text-gray-900">{formatDate(policy.end_date)}</p>
                    </div>
                    {policy.next_payment_date && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pembayaran Berikutnya</p>
                        <p className="font-medium text-orange-600">{formatDate(policy.next_payment_date)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Premi Tahunan</p>
                      <p className="font-medium text-gray-900">{formatCurrency(policy.premium)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coverage Tab */}
            {activeTab === 'coverage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">✅ Cakupan Perlindungan</h3>
                  <ul className="space-y-3">
                    {policy.coverage_details.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">❌ Pengecualian</h3>
                  <ul className="space-y-3">
                    {policy.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Beneficiaries Tab */}
            {activeTab === 'beneficiaries' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Daftar Ahli Waris</h3>
                <div className="space-y-4">
                  {policy.beneficiaries.map((ben, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{ben.name}</p>
                          <p className="text-sm text-gray-600">{ben.relationship}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{ben.percentage}%</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(policy.sum_assured * ben.percentage / 100)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Riwayat Pembayaran Premi</h3>
                <div className="space-y-3">
                  {policy.payment_history.map((payment, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(payment.date)}</p>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                        <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${getStatusColor(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
