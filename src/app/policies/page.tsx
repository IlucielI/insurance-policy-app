'use client'

import { useState, useEffect, useMemo } from 'react'
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

interface Filters {
  search: string
  status: string
  dateFrom: string
  dateTo: string
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchPolicies()
  }, [filters])

  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      
      // Build query params
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.dateFrom) params.append('date_from', filters.dateFrom)
      if (filters.dateTo) params.append('date_to', filters.dateTo)
      
      const res = await fetch(`${apiUrl}/policies?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
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

  const stats = useMemo(() => ({
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    totalCoverage: policies.reduce((sum, p) => sum + p.sum_assured, 0),
    monthlyPremium: policies.filter(p => p.status === 'active').reduce((sum, p) => sum + (p.premium / 12), 0)
  }), [policies])

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    })
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
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
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Polis Saya</h1>
          <p className="text-gray-600">Kelola dan pantau semua polis asuransi Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Polis</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Polis Aktif</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Pertanggungan</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.totalCoverage)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Premi Bulanan</p>
            <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.monthlyPremium)}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">🔍 Cari & Filter</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Cari Nomor Polis / Produk
              </label>
              <input
                type="text"
                placeholder="Cari POL-2026-001234, Asuransi Jiwa..."
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="pending">Pending</option>
                <option value="expired">Kedaluwarsa</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Tanggal Mulai Dari
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To - on new row for mobile */}
            <div className="lg:col-start-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Tanggal Mulai Sampai
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{policies.length}</span> polis
          </div>
        </div>

        {/* Policies List */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Memuat polis...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 mb-4 text-lg">
              {hasActiveFilters ? 'Tidak ada polis yang sesuai filter' : 'Tidak ada polis yang ditemukan'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Reset Filter
              </button>
            ) : (
              <Link
                href="/products"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Beli Polis Baru
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map(policy => (
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
