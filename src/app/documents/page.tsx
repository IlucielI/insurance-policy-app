'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Document {
  id: string
  policy_id?: string
  policy_number?: string
  policy_name?: string
  title: string
  type: 'policy' | 'claim' | 'payment' | 'certificate' | 'other'
  file_name: string
  file_size: number
  file_url: string
  uploaded_date: string
  description?: string
}

function DocumentsContent() {
  const searchParams = useSearchParams()
  const preselectedPolicyId = searchParams.get('policy_id')

  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState(preselectedPolicyId || '')

  useEffect(() => {
    fetchDocuments()
  }, [selectedPolicy])

  const fetchDocuments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const params = new URLSearchParams()
      if (selectedPolicy) params.append('policy_id', selectedPolicy)

      const res = await fetch(`${apiUrl}/documents?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      setDocuments(data.data || [])
    } catch (err) {
      console.error('Failed to fetch documents:', err)
      // Mock data
      setDocuments([
        {
          id: '1',
          policy_id: '1',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          title: 'Polis Asuransi Jiwa Premium',
          type: 'policy',
          file_name: 'POL-2026-001234.pdf',
          file_size: 245000,
          file_url: '/documents/pol-001234.pdf',
          uploaded_date: '2026-01-15',
          description: 'Dokumen polis lengkap dengan terms & conditions'
        },
        {
          id: '2',
          policy_id: '1',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          title: 'Sertifikat Polis',
          type: 'certificate',
          file_name: 'Certificate-POL-001234.pdf',
          file_size: 120000,
          file_url: '/documents/cert-001234.pdf',
          uploaded_date: '2026-01-15',
          description: 'Sertifikat kepemilikan polis'
        },
        {
          id: '3',
          policy_id: '2',
          policy_number: 'POL-2026-001567',
          policy_name: 'Asuransi Kesehatan Plus',
          title: 'Polis Asuransi Kesehatan',
          type: 'policy',
          file_name: 'POL-2026-001567.pdf',
          file_size: 198000,
          file_url: '/documents/pol-001567.pdf',
          uploaded_date: '2026-03-01'
        },
        {
          id: '4',
          policy_id: '1',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          title: 'Invoice Pembayaran Januari 2026',
          type: 'payment',
          file_name: 'INV-2026-01-001234.pdf',
          file_size: 85000,
          file_url: '/documents/inv-jan2026.pdf',
          uploaded_date: '2026-01-10'
        },
        {
          id: '5',
          policy_id: '1',
          policy_number: 'POL-2026-001234',
          policy_name: 'Asuransi Jiwa Premium',
          title: 'Klaim Rawat Inap - Disetujui',
          type: 'claim',
          file_name: 'CLM-2026-00123-Approval.pdf',
          file_size: 156000,
          file_url: '/documents/claim-123.pdf',
          uploaded_date: '2026-08-28',
          description: 'Surat persetujuan klaim rawat inap'
        },
        {
          id: '6',
          title: 'Panduan Klaim Asuransi',
          type: 'other',
          file_name: 'Panduan-Klaim-2026.pdf',
          file_size: 542000,
          file_url: '/documents/panduan-klaim.pdf',
          uploaded_date: '2026-01-01',
          description: 'Panduan lengkap cara mengajukan klaim'
        },
        {
          id: '7',
          title: 'Brosur Produk Asuransi',
          type: 'other',
          file_name: 'Brosur-Produk-2026.pdf',
          file_size: 1240000,
          file_url: '/documents/brosur.pdf',
          uploaded_date: '2026-01-01',
          description: 'Informasi lengkap semua produk asuransi'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
      policy: '📄',
      claim: '📋',
      payment: '💳',
      certificate: '🏆',
      other: '📁'
    }
    return icons[type] || '📄'
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      policy: 'Dokumen Polis',
      claim: 'Dokumen Klaim',
      payment: 'Invoice/Bukti Bayar',
      certificate: 'Sertifikat',
      other: 'Lainnya'
    }
    return labels[type] || type
  }

  const filteredDocuments = documents.filter(doc => {
    // Filter by type
    if (filter !== 'all' && doc.type !== filter) return false
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.file_name.toLowerCase().includes(query) ||
        doc.policy_number?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const key = doc.policy_name || 'Dokumen Umum'
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {} as Record<string, Document[]>)

  const handleDownload = (doc: Document) => {
    // In production, this would trigger actual download
    console.log('Downloading:', doc.file_name)
    // window.open(doc.file_url, '_blank')
    alert(`Download: ${doc.file_name}`)
  }

  const handleShare = (doc: Document) => {
    // In production, this would generate a share link
    alert(`Share link generated for: ${doc.title}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Insurance</Link>
          <nav className="flex gap-6">
            <Link href="/policies" className="text-gray-700 hover:text-blue-600 font-medium">Polis Saya</Link>
            <Link href="/claims" className="text-gray-700 hover:text-blue-600 font-medium">Klaim</Link>
            <Link href="/billing" className="text-gray-700 hover:text-blue-600 font-medium">Tagihan</Link>
            <Link href="/documents" className="text-blue-600 font-medium">Dokumen</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Perpustakaan Dokumen</h1>
          <p className="text-gray-600">Akses semua dokumen polis, klaim, dan pembayaran Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Dokumen</p>
            <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Dokumen Polis</p>
            <p className="text-3xl font-bold text-blue-600">
              {documents.filter(d => d.type === 'policy').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Dokumen Klaim</p>
            <p className="text-3xl font-bold text-green-600">
              {documents.filter(d => d.type === 'claim').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Ukuran</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatFileSize(documents.reduce((sum, d) => sum + d.file_size, 0))}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Dokumen</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama file, polis..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Jenis Dokumen</h3>
              <div className="space-y-2">
                {[
                  { key: 'all', label: 'Semua', count: documents.length },
                  { key: 'policy', label: 'Polis', count: documents.filter(d => d.type === 'policy').length },
                  { key: 'claim', label: 'Klaim', count: documents.filter(d => d.type === 'claim').length },
                  { key: 'payment', label: 'Pembayaran', count: documents.filter(d => d.type === 'payment').length },
                  { key: 'certificate', label: 'Sertifikat', count: documents.filter(d => d.type === 'certificate').length },
                  { key: 'other', label: 'Lainnya', count: documents.filter(d => d.type === 'other').length }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between ${
                      filter === item.key
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-sm">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Dokumen tersimpan aman</li>
                <li>• Akses kapan saja</li>
                <li>• Download unlimited</li>
                <li>• Share via link</li>
              </ul>
            </div>
          </div>

          {/* Main Content - Documents List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Memuat dokumen...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600 mb-2">Tidak ada dokumen ditemukan</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedDocuments).map(([groupName, docs]) => (
                  <div key={groupName}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                      {groupName}
                      <span className="text-sm font-normal text-gray-600 ml-2">({docs.length} dokumen)</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {docs.map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg shadow-sm border hover:shadow-md transition p-4"
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="text-4xl flex-shrink-0">
                              {getDocumentIcon(doc.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">{doc.title}</h3>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                                  {getDocumentTypeLabel(doc.type).split(' ')[0]}
                                </span>
                              </div>

                              <p className="text-xs text-gray-600 mb-2 truncate">{doc.file_name}</p>
                              
                              {doc.description && (
                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{doc.description}</p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span>{formatFileSize(doc.file_size)}</span>
                                <span>{formatDate(doc.uploaded_date)}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                                >
                                  Download
                                </button>
                                <button
                                  onClick={() => handleShare(doc)}
                                  className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                                >
                                  Share
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Perlu dokumen yang tidak tersedia?</h3>
              <p className="text-blue-100">
                Hubungi customer service kami untuk request dokumen tambahan atau bantuan lainnya
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/chat"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition whitespace-nowrap"
              >
                Chat Sekarang
              </Link>
              <a
                href="mailto:support@insurance.id"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition whitespace-nowrap"
              >
                Email Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    }>
      <DocumentsContent />
    </Suspense>
  )
}
