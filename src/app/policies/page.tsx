'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Policy {
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
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/policies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setPolicies(data.data || [])
    } catch (err) {
      console.error('Failed to fetch policies:', err)
      // Mock data fallback
      setPolicies([
        {
          id: '1',
          policy_number: 'POL-2026-001234',
          product_name: 'Asuransi Jiwa Premium',
          category: 'life',
          status: 'active',
          sum_assured: 500000000,
          premium: 2750000,
          start_date: '2026-01-15',
          end_date: '2027-01-15',
          next_payment_date: '2027-01-15'
        },
        {
          id: '2',
          policy_number: 'POL-2026-001567',
          product_name: 'Asuransi Kesehatan Plus',
          category: 'health',
          status: 'active',
          sum_assured: 200000000,
          premium: 600000,
          start_date: '2026-03-01',
          end_date: '2027-03-01',
          next_payment_date: '2027-03-01'
        },
        {
          id: '3',
          policy_number: 'POL-2025-009876',
          product_name: 'Asuransi Kendaraan Comprehensive',
          category: 'vehicle',
          status: 'expired',
          sum_assured: 300000000,
          premium: 18600000,
          start_date: '2025-06-10',
          end_date: '2026-06-10'
        }
      ])
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

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      life: 'Jiwa',
      health: 'Kesehatan',
      vehicle: 'Kendaraan'
    }
    return labels[cat] || cat
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktif',
      pending: 'Pending',
      expired: 'Kedaluwarsa',
      cancelled: 'Dibatalkan'
    }
    return labels[status] || status
  }

  const filteredPolicies = policies.filter(p => 
    filter === 'all' || p.status === filter
  )

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
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Produk
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Polis Saya</h1>
          <p className="text-gray-600">Kelola dan pantau semua polis asuransi Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Polis</p>
            <p className="text-3xl font-bold text-gray-900">{policies.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Polis Aktif</p>
            <p className="text-3xl font-bold text-green-600">
              {policies.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Pertanggungan</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.sum_assured, 0))}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Premi Bulanan</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.premium, 0))}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'active', label: 'Aktif' },
            { key: 'pending', label: 'Pending' },
            { key: 'expired', label: 'Kedaluwarsa' }
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

        {/* Policies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat polis...</p>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">Tidak ada polis yang ditemukan</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Beli Polis Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPolicies.map(policy => (
              <div
                key={policy.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side - Policy Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(policy.status)}`}>
                        {getStatusLabel(policy.status)}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
                        {getCategoryLabel(policy.category)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{policy.product_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      No. Polis: <span className="font-medium text-gray-900">{policy.policy_number}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Jumlah Pertanggungan</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(policy.sum_assured)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Premi</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(policy.premium)}/tahun</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Periode</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(policy.start_date)} - {formatDate(policy.end_date)}
                        </p>
                      </div>
                      {policy.next_payment_date && (
                        <div>
                          <p className="text-gray-600">Pembayaran Berikutnya</p>
                          <p className="font-medium text-orange-600">{formatDate(policy.next_payment_date)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <Link
                      href={`/policies/${policy.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                    >
                      Lihat Detail
                    </Link>
                    {policy.status === 'active' && (
                      <>
                        <Link
                          href={`/claims/new?policy_id=${policy.id}`}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-center"
                        >
                          Ajukan Klaim
                        </Link>
                        <Link
                          href={`/billing?policy_id=${policy.id}`}
                          className="text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition text-center"
                        >
                          Bayar Premi
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
