'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Policy {
  id: string
  policy_number: string
  product_name: string
  category: string
  status: string
  sum_assured: number
  premium: number
  start_date: string
  end_date: string
  total_paid: number
}

interface FormData {
  cancellation_reason: string
  detailed_reason: string
  effective_date: string
  refund_method: string
  acknowledge_cooling_off: boolean
  acknowledge_consequences: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function PolicyCancellationPage() {
  const params = useParams()
  const router = useRouter()
  const policyId = params.id as string
  
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [refundAmount, setRefundAmount] = useState<number | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    cancellation_reason: '',
    detailed_reason: '',
    effective_date: '',
    refund_method: '',
    acknowledge_cooling_off: false,
    acknowledge_consequences: false
  })

  useEffect(() => {
    fetchPolicy()
  }, [policyId])

  useEffect(() => {
    if (policy) {
      calculateRefund()
    }
  }, [policy, formData.effective_date])

  const fetchPolicy = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setPolicy(data.data)
    } catch (err) {
      console.error('Failed to fetch policy:', err)
      // Mock data
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
        total_paid: 8250000
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateRefund = () => {
    if (!policy) return

    const startDate = new Date(policy.start_date)
    const endDate = new Date(policy.end_date)
    const effectiveDate = formData.effective_date ? new Date(formData.effective_date) : new Date()
    
    // Check if within cooling-off period (14 days from start)
    const coolingOffEnd = new Date(startDate)
    coolingOffEnd.setDate(coolingOffEnd.getDate() + 14)
    const isWithinCoolingOff = effectiveDate <= coolingOffEnd

    if (isWithinCoolingOff) {
      // Full refund during cooling-off period
      setRefundAmount(policy.total_paid)
    } else {
      // Pro-rata refund calculation
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const daysUsed = (effectiveDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const remainingDays = totalDays - daysUsed
      
      if (remainingDays > 0) {
        const proRataRefund = (remainingDays / totalDays) * policy.premium
        // Apply cancellation fee (10%)
        const refund = proRataRefund * 0.9
        setRefundAmount(Math.max(0, refund))
      } else {
        setRefundAmount(0)
      }
    }
  }

  const isWithinCoolingOff = () => {
    if (!policy) return false
    const startDate = new Date(policy.start_date)
    const coolingOffEnd = new Date(startDate)
    coolingOffEnd.setDate(coolingOffEnd.getDate() + 14)
    return new Date() <= coolingOffEnd
  }

  const getDaysInCoolingOff = () => {
    if (!policy) return 0
    const startDate = new Date(policy.start_date)
    const coolingOffEnd = new Date(startDate)
    coolingOffEnd.setDate(coolingOffEnd.getDate() + 14)
    const daysRemaining = Math.ceil((coolingOffEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, daysRemaining)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.cancellation_reason) {
      newErrors.cancellation_reason = 'Pilih alasan pembatalan'
    }

    if (!formData.detailed_reason || formData.detailed_reason.length < 20) {
      newErrors.detailed_reason = 'Penjelasan minimal 20 karakter'
    }

    if (!formData.effective_date) {
      newErrors.effective_date = 'Tanggal efektif wajib diisi'
    } else {
      const effectiveDate = new Date(formData.effective_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (effectiveDate < today) {
        newErrors.effective_date = 'Tanggal efektif tidak boleh di masa lalu'
      }
    }

    if (!formData.refund_method) {
      newErrors.refund_method = 'Pilih metode pengembalian dana'
    }

    if (!formData.acknowledge_consequences) {
      newErrors.acknowledge_consequences = 'Anda harus memahami konsekuensi pembatalan'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setShowConfirmation(true)
  }

  const confirmCancellation = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}/cancellations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push(`/policies?cancellation_success=true`)
      } else {
        throw new Error('Cancellation failed')
      }
    } catch (err) {
      console.error('Failed to submit cancellation:', err)
      alert('Gagal mengajukan pembatalan. Silakan coba lagi.')
      setShowConfirmation(false)
    } finally {
      setSubmitting(false)
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

  const cancellationReasons = [
    'Premi terlalu mahal',
    'Menemukan produk yang lebih baik',
    'Tidak memerlukan asuransi lagi',
    'Situasi keuangan berubah',
    'Tidak puas dengan layanan',
    'Pindah ke perusahaan asuransi lain',
    'Produk tidak sesuai kebutuhan',
    'Alasan pribadi/keluarga',
    'Lainnya'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
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

  if (policy.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Polis Tidak Aktif</h2>
          <p className="text-gray-600 mb-6">
            Hanya polis aktif yang dapat dibatalkan. Status polis Anda saat ini: <strong>{policy.status}</strong>
          </p>
          <Link 
            href={`/policies/${policyId}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Lihat Detail Polis
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                Pembayaran
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium">
                Bantuan
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Konfirmasi Pembatalan Polis</h3>
              <p className="text-gray-600 text-sm">
                Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah mempertimbangkan dengan matang.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Polis:</span>
                <span className="font-semibold">{policy.policy_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produk:</span>
                <span className="font-semibold">{policy.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimasi Refund:</span>
                <span className="font-semibold text-green-600">
                  {refundAmount !== null ? formatCurrency(refundAmount) : '-'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={submitting}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmCancellation}
                disabled={submitting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Memproses...' : 'Ya, Batalkan Polis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/policies" className="hover:text-blue-600">Polis</Link>
          <span>/</span>
          <Link href={`/policies/${policyId}`} className="hover:text-blue-600">{policy.policy_number}</Link>
          <span>/</span>
          <span className="text-gray-900">Pembatalan</span>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex gap-3">
              <div className="text-3xl">🛑</div>
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-2">Pembatalan Polis</h2>
                <p className="text-sm text-red-800 mb-3">
                  Mohon pertimbangkan dengan matang sebelum membatalkan polis. Anda akan kehilangan perlindungan asuransi.
                </p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Perlindungan akan berakhir pada tanggal efektif pembatalan</li>
                  <li>• Premi yang sudah dibayar mungkin tidak dapat dikembalikan seluruhnya</li>
                  <li>• Membeli polis baru di masa depan mungkin lebih mahal</li>
                  <li>• Kondisi kesehatan Anda saat ini mungkin tidak dapat diasuransikan lagi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cooling-off Period Notice */}
          {isWithinCoolingOff() && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">✅</div>
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">Anda Masih dalam Cooling-off Period!</p>
                  <p>
                    Anda dapat membatalkan polis dengan <strong>pengembalian dana 100%</strong> dalam {getDaysInCoolingOff()} hari lagi 
                    (14 hari sejak polis aktif).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Policy Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Detail Polis yang Akan Dibatalkan</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nomor Polis</p>
                <p className="font-semibold">{policy.policy_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Produk</p>
                <p className="font-semibold">{policy.product_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Tanggal Mulai</p>
                <p className="font-semibold">{formatDate(policy.start_date)}</p>
              </div>
              <div>
                <p className="text-gray-600">Tanggal Berakhir</p>
                <p className="font-semibold">{formatDate(policy.end_date)}</p>
              </div>
              <div>
                <p className="text-gray-600">Uang Pertanggungan</p>
                <p className="font-semibold">{formatCurrency(policy.sum_assured)}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Premi Dibayar</p>
                <p className="font-semibold">{formatCurrency(policy.total_paid)}</p>
              </div>
            </div>
          </div>

          {/* Cancellation Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h3 className="text-xl font-bold">Form Pembatalan Polis</h3>

            {/* Cancellation Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Pembatalan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cancellation_reason}
                onChange={(e) => setFormData({ ...formData, cancellation_reason: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cancellation_reason ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih alasan</option>
                {cancellationReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              {errors.cancellation_reason && (
                <p className="text-red-500 text-sm mt-1">{errors.cancellation_reason}</p>
              )}
            </div>

            {/* Detailed Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penjelasan Detail <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Mohon jelaskan alasan pembatalan secara detail. Masukan Anda membantu kami meningkatkan layanan."
                value={formData.detailed_reason}
                onChange={(e) => setFormData({ ...formData, detailed_reason: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.detailed_reason ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.detailed_reason && (
                <p className="text-red-500 text-sm mt-1">{errors.detailed_reason}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{formData.detailed_reason.length} / 20 karakter minimum</p>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Efektif Pembatalan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.effective_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.effective_date && (
                <p className="text-red-500 text-sm mt-1">{errors.effective_date}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Perlindungan akan berakhir pada tanggal ini</p>
            </div>

            {/* Refund Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pengembalian Dana <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.refund_method}
                onChange={(e) => setFormData({ ...formData, refund_method: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.refund_method ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih metode</option>
                <option value="bank_transfer">Transfer Bank (5-7 hari kerja)</option>
                <option value="original_payment">Ke Metode Pembayaran Asli (7-14 hari kerja)</option>
                <option value="check">Cek (14-21 hari kerja)</option>
              </select>
              {errors.refund_method && (
                <p className="text-red-500 text-sm mt-1">{errors.refund_method}</p>
              )}
            </div>

            {/* Refund Estimate */}
            {refundAmount !== null && formData.effective_date && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Estimasi Pengembalian Dana</h4>
                <div className="space-y-2 text-sm">
                  {isWithinCoolingOff() ? (
                    <div className="text-green-700">
                      <p className="font-medium">✓ Cooling-off Period - Refund 100%</p>
                      <p className="text-xs mt-1">Anda akan menerima seluruh premi yang telah dibayar</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premi dibayar</span>
                        <span className="font-medium">{formatCurrency(policy.total_paid)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Pro-rata refund</span>
                        <span>~{formatCurrency(refundAmount / 0.9)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Biaya pembatalan (10%)</span>
                        <span>-{formatCurrency((refundAmount / 0.9) * 0.1)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-blue-300 text-lg font-bold">
                    <span>Estimasi Refund</span>
                    <span className="text-blue-600">{formatCurrency(refundAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Estimasi ini belum final dan dapat berubah setelah review
                  </p>
                </div>
              </div>
            )}

            {/* Acknowledgments */}
            <div className="border-t pt-6 space-y-4">
              <h4 className="font-semibold">Konfirmasi & Persetujuan</h4>
              
              {isWithinCoolingOff() && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acknowledge_cooling_off}
                    onChange={(e) => setFormData({ ...formData, acknowledge_cooling_off: e.target.checked })}
                    className="mt-1 rounded"
                  />
                  <span className="text-sm">
                    Saya memahami bahwa saya berada dalam cooling-off period dan berhak atas pengembalian dana 100%
                  </span>
                </label>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acknowledge_consequences}
                  onChange={(e) => setFormData({ ...formData, acknowledge_consequences: e.target.checked })}
                  className="mt-1 rounded"
                />
                <div className="text-sm">
                  <span className="font-medium">Saya memahami konsekuensi pembatalan polis: <span className="text-red-500">*</span></span>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Perlindungan asuransi akan berakhir sepenuhnya</li>
                    <li>• Saya tidak akan menerima manfaat apapun setelah pembatalan</li>
                    <li>• Membeli polis baru mungkin lebih mahal atau tidak disetujui</li>
                    <li>• Proses refund memerlukan waktu sesuai metode yang dipilih</li>
                  </ul>
                </div>
              </label>
              {errors.acknowledge_consequences && (
                <p className="text-red-500 text-sm">{errors.acknowledge_consequences}</p>
              )}
            </div>

            {/* Alternative Options */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-amber-900">💡 Pertimbangkan Alternatif Lain</h4>
              <p className="text-sm text-amber-800 mb-3">
                Sebelum membatalkan, Anda mungkin tertarik dengan opsi berikut:
              </p>
              <div className="space-y-2 text-sm">
                <Link 
                  href={`/policies/${policyId}/endorse`}
                  className="block bg-white border border-amber-300 rounded px-3 py-2 hover:bg-amber-50 transition"
                >
                  <strong>Kurangi Cakupan</strong> - Turunkan uang pertanggungan untuk premi lebih murah
                </Link>
                <Link 
                  href={`/support`}
                  className="block bg-white border border-amber-300 rounded px-3 py-2 hover:bg-amber-50 transition"
                >
                  <strong>Bicara dengan Agen</strong> - Diskusikan solusi yang lebih sesuai
                </Link>
                <div className="bg-white border border-amber-300 rounded px-3 py-2">
                  <strong>Grace Period</strong> - Tunda pembayaran hingga 30 hari tanpa kehilangan polis
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link
                href={`/policies/${policyId}`}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition text-center"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajukan Pembatalan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
