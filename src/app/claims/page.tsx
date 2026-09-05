'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Claim {
  id: string
  claim_number: string
  policy_number: string
  policy_name: string
  claim_type: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid'
  amount_claimed: number
  amount_approved?: number
  submitted_date?: string
  updated_date: string
  incident_date: string
  description: string
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const res = await fetch(`${apiUrl}/claims`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      setClaims(data.data || [])
    } catch (err) {
      console.error('Failed to fetch claims:', err)
      // Mock data fallback
      setClaims([
        {
          id: '1',
          claim_number: 'CLM-2026-00123',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          claim_type: 'Rawat Inap',
          status: 'under_review',
          amount_claimed: 15000000,
          submitted_date: '2026-08-25',
          updated_date: '2026-08-28',
          incident_date: '2026-08-20',
          description: 'Rawat inap akibat kecelakaan lalu lintas'
        },
        {
          id: '2',
          claim_number: 'CLM-2026-00089',
          policy_number: 'POL-2026-001567',
          policy_name: 'Asuransi Kesehatan Plus',
          claim_type: 'Biaya Medis',
          status: 'approved',
          amount_claimed: 8500000,
          amount_approved: 8500000,
          submitted_date: '2026-07-10',
          updated_date: '2026-07-18',
          incident_date: '2026-07-05',
          description: 'Operasi appendisitis'
        },
        {
          id: '3',
          claim_number: 'CLM-2026-00045',
          policy_number: 'POL-2025-009876',
          policy_name: 'Asuransi Kendaraan Comprehensive',
          claim_type: 'Kerusakan Kendaraan',
          status: 'paid',
          amount_claimed: 12000000,
          amount_approved: 12000000,
          submitted_date: '2026-06-01',
          updated_date: '2026-06-15',
          incident_date: '2026-05-28',
          description: 'Kerusakan body mobil akibat tabrakan'
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      paid: 'bg-purple-100 text-purple-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Diajukan',
      under_review: 'Sedang Diproses',
      approved: 'Disetujui',
      rejected: 'Ditolak',
      paid: 'Dibayarkan'
    }
    return labels[status] || status
  }

  const filteredClaims = claims.filter(c => 
    filter === 'all' || c.status === filter
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
            <Link href="/policies" className="text-gray-700 hover:text-blue-600 font-medium">
              Polis Saya
            </Link>
            <Link href="/claims" className="text-blue-600 font-medium">
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manajemen Klaim</h1>
            <p className="text-gray-600">Ajukan dan pantau status klaim asuransi Anda</p>
          </div>
          <Link
            href="/claims/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ajukan Klaim Baru
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Klaim</p>
            <p className="text-3xl font-bold text-gray-900">{claims.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Sedang Diproses</p>
            <p className="text-3xl font-bold text-yellow-600">
              {claims.filter(c => c.status === 'under_review' || c.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Disetujui</p>
            <p className="text-3xl font-bold text-green-600">
              {claims.filter(c => c.status === 'approved' || c.status === 'paid').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Dibayarkan</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                claims
                  .filter(c => c.status === 'paid')
                  .reduce((sum, c) => sum + (c.amount_approved || 0), 0)
              )}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'submitted', label: 'Diajukan' },
            { key: 'under_review', label: 'Diproses' },
            { key: 'approved', label: 'Disetujui' },
            { key: 'paid', label: 'Dibayarkan' },
            { key: 'rejected', label: 'Ditolak' }
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

        {/* Claims List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat klaim...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">Tidak ada klaim yang ditemukan</p>
            <Link
              href="/claims/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Ajukan Klaim Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClaims.map(claim => (
              <div
                key={claim.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side - Claim Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(claim.status)}`}>
                        {getStatusLabel(claim.status)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">
                        {claim.claim_type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-1">{claim.policy_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Klaim: <span className="font-medium text-gray-900">{claim.claim_number}</span> • 
                      Polis: <span className="font-medium text-gray-900">{claim.policy_number}</span>
                    </p>
                    <p className="text-sm text-gray-700 mb-3">{claim.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Tanggal Kejadian</p>
                        <p className="font-medium text-gray-900">{formatDate(claim.incident_date)}</p>
                      </div>
                      {claim.submitted_date && (
                        <div>
                          <p className="text-gray-600">Tanggal Diajukan</p>
                          <p className="font-medium text-gray-900">{formatDate(claim.submitted_date)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Jumlah Diajukan</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(claim.amount_claimed)}</p>
                      </div>
                      {claim.amount_approved && (
                        <div>
                          <p className="text-gray-600">Jumlah Disetujui</p>
                          <p className="font-semibold text-green-600">{formatCurrency(claim.amount_approved)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col gap-2 md:w-40">
                    <Link
                      href={`/claims/${claim.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                    >
                      Lihat Detail
                    </Link>
                    {claim.status === 'draft' && (
                      <Link
                        href={`/claims/${claim.id}/edit`}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-center"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Butuh Bantuan dengan Klaim?</h3>
          <p className="text-sm text-blue-800 mb-4">
            Tim customer service kami siap membantu Anda 24/7. Hubungi kami melalui:
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+628001234567" className="text-sm bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
              📞 0800-123-4567
            </a>
            <a href="mailto:claims@insurance.id" className="text-sm bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
              ✉️ claims@insurance.id
            </a>
            <Link href="/chat" className="text-sm bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
              💬 Live Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
