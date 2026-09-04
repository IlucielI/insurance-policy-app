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
}

interface FormData {
  endorsement_type: string
  coverage_change?: {
    new_sum_assured?: string
    additional_coverage?: string[]
  }
  beneficiary_change?: {
    action: 'add' | 'modify' | 'remove'
    name?: string
    relationship?: string
    percentage?: string
    existing_beneficiary_id?: string
  }
  personal_info_change?: {
    field: string
    current_value: string
    new_value: string
  }
  reason: string
  effective_date: string
}

interface FormErrors {
  [key: string]: string
}

export default function PolicyEndorsementPage() {
  const params = useParams()
  const router = useRouter()
  const policyId = params.id as string
  
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<FormData>({
    endorsement_type: '',
    reason: '',
    effective_date: ''
  })

  useEffect(() => {
    fetchPolicy()
  }, [policyId])

  const fetchPolicy = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setPolicy(data.data)
    } catch (err) {
      console.error('Failed to fetch policy:', err)
      setPolicy({
        id: policyId,
        policy_number: 'POL-2026-001234',
        product_name: 'Asuransi Jiwa Premium',
        category: 'life',
        status: 'active'
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.endorsement_type) {
      newErrors.endorsement_type = 'Pilih jenis perubahan'
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

    if (!formData.reason || formData.reason.length < 10) {
      newErrors.reason = 'Alasan minimal 10 karakter'
    }

    // Type-specific validation
    if (formData.endorsement_type === 'coverage_change') {
      if (!formData.coverage_change?.new_sum_assured && !formData.coverage_change?.additional_coverage?.length) {
        newErrors.coverage_change = 'Masukkan perubahan cakupan yang diinginkan'
      }
      if (formData.coverage_change?.new_sum_assured) {
        const amount = parseFloat(formData.coverage_change.new_sum_assured)
        if (isNaN(amount) || amount <= 0) {
          newErrors.coverage_change = 'Jumlah pertanggungan harus lebih dari 0'
        }
      }
    }

    if (formData.endorsement_type === 'beneficiary_change') {
      if (!formData.beneficiary_change?.action) {
        newErrors.beneficiary_change = 'Pilih jenis perubahan ahli waris'
      }
      if (formData.beneficiary_change?.action !== 'remove') {
        if (!formData.beneficiary_change?.name) {
          newErrors.beneficiary_name = 'Nama ahli waris wajib diisi'
        }
        if (!formData.beneficiary_change?.relationship) {
          newErrors.beneficiary_relationship = 'Hubungan wajib diisi'
        }
        if (!formData.beneficiary_change?.percentage) {
          newErrors.beneficiary_percentage = 'Persentase wajib diisi'
        } else {
          const pct = parseFloat(formData.beneficiary_change.percentage)
          if (isNaN(pct) || pct <= 0 || pct > 100) {
            newErrors.beneficiary_percentage = 'Persentase harus antara 1-100'
          }
        }
      }
    }

    if (formData.endorsement_type === 'personal_info_change') {
      if (!formData.personal_info_change?.field) {
        newErrors.personal_info_field = 'Pilih informasi yang ingin diubah'
      }
      if (!formData.personal_info_change?.new_value) {
        newErrors.personal_info_new_value = 'Nilai baru wajib diisi'
      }
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

    setSubmitting(true)
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}/endorsements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push(`/policies/${policyId}?endorsement_success=true`)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      console.error('Failed to submit endorsement:', err)
      alert('Gagal mengajukan endorsement. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const additionalCoverageOptions = [
    'Santunan Cacat Tetap Sebagian',
    'Santunan Rawat Inap Harian',
    'Santunan Penyakit Kritis',
    'Rider Kecelakaan Diri',
    'Rider Pembebasan Premi',
    'Critical Illness Rider'
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

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/policies" className="hover:text-blue-600">Polis</Link>
          <span>/</span>
          <Link href={`/policies/${policyId}`} className="hover:text-blue-600">{policy.policy_number}</Link>
          <span>/</span>
          <span className="text-gray-900">Endorsement</span>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Header Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">🔄 Pengajuan Policy Endorsement</h1>
            <p className="text-gray-600 mb-4">
              Ajukan perubahan pada polis Anda seperti perubahan cakupan, ahli waris, atau informasi pribadi
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nomor Polis</p>
                  <p className="font-semibold text-gray-900">{policy.policy_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Produk</p>
                  <p className="font-semibold text-gray-900">{policy.product_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-2xl">ℹ️</div>
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-2">Catatan Penting:</p>
                <ul className="space-y-1">
                  <li>• Perubahan polis akan diproses dalam 3-5 hari kerja</li>
                  <li>• Beberapa perubahan mungkin memerlukan medical check-up ulang</li>
                  <li>• Perubahan cakupan dapat mempengaruhi premi Anda</li>
                  <li>• Dokumen pendukung mungkin diperlukan untuk verifikasi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            {/* Endorsement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Perubahan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.endorsement_type}
                onChange={(e) => setFormData({ ...formData, endorsement_type: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endorsement_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih jenis perubahan</option>
                <option value="coverage_change">Perubahan Cakupan / Uang Pertanggungan</option>
                <option value="beneficiary_change">Perubahan Ahli Waris</option>
                <option value="personal_info_change">Perubahan Informasi Pribadi</option>
              </select>
              {errors.endorsement_type && (
                <p className="text-red-500 text-sm mt-1">{errors.endorsement_type}</p>
              )}
            </div>

            {/* Coverage Change Fields */}
            {formData.endorsement_type === 'coverage_change' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Detail Perubahan Cakupan</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uang Pertanggungan Baru (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="500000000"
                    value={formData.coverage_change?.new_sum_assured || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      coverage_change: { ...formData.coverage_change, new_sum_assured: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tambahan Cakupan (Rider)
                  </label>
                  <div className="space-y-2">
                    {additionalCoverageOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.coverage_change?.additional_coverage?.includes(option) || false}
                          onChange={(e) => {
                            const current = formData.coverage_change?.additional_coverage || []
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter(c => c !== option)
                            setFormData({
                              ...formData,
                              coverage_change: { ...formData.coverage_change, additional_coverage: updated }
                            })
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {errors.coverage_change && (
                  <p className="text-red-500 text-sm">{errors.coverage_change}</p>
                )}
              </div>
            )}

            {/* Beneficiary Change Fields */}
            {formData.endorsement_type === 'beneficiary_change' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Detail Perubahan Ahli Waris</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aksi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.beneficiary_change?.action || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      beneficiary_change: { ...formData.beneficiary_change, action: e.target.value as any }
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.beneficiary_change ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih aksi</option>
                    <option value="add">Tambah Ahli Waris Baru</option>
                    <option value="modify">Ubah Ahli Waris Existing</option>
                    <option value="remove">Hapus Ahli Waris</option>
                  </select>
                  {errors.beneficiary_change && (
                    <p className="text-red-500 text-sm mt-1">{errors.beneficiary_change}</p>
                  )}
                </div>

                {formData.beneficiary_change?.action && formData.beneficiary_change.action !== 'remove' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ahli Waris <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nama lengkap"
                        value={formData.beneficiary_change?.name || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          beneficiary_change: { 
                            action: formData.beneficiary_change?.action || 'add',
                            ...formData.beneficiary_change, 
                            name: e.target.value 
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.beneficiary_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.beneficiary_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.beneficiary_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hubungan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.beneficiary_change?.relationship || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          beneficiary_change: { 
                            action: formData.beneficiary_change?.action || 'add',
                            ...formData.beneficiary_change, 
                            relationship: e.target.value 
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.beneficiary_relationship ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Pilih hubungan</option>
                        <option value="Suami">Suami</option>
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Saudara">Saudara</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      {errors.beneficiary_relationship && (
                        <p className="text-red-500 text-sm mt-1">{errors.beneficiary_relationship}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Persentase (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="50"
                        value={formData.beneficiary_change?.percentage || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          beneficiary_change: { 
                            action: formData.beneficiary_change?.action || 'add',
                            ...formData.beneficiary_change, 
                            percentage: e.target.value 
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.beneficiary_percentage ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.beneficiary_percentage && (
                        <p className="text-red-500 text-sm mt-1">{errors.beneficiary_percentage}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Personal Info Change Fields */}
            {formData.endorsement_type === 'personal_info_change' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Detail Perubahan Informasi</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informasi yang Diubah <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.personal_info_change?.field || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal_info_change: { ...formData.personal_info_change, field: e.target.value, current_value: '', new_value: '' }
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.personal_info_field ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih informasi</option>
                    <option value="phone">Nomor Telepon</option>
                    <option value="email">Email</option>
                    <option value="address">Alamat</option>
                    <option value="occupation">Pekerjaan</option>
                  </select>
                  {errors.personal_info_field && (
                    <p className="text-red-500 text-sm mt-1">{errors.personal_info_field}</p>
                  )}
                </div>

                {formData.personal_info_change?.field && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nilai Saat Ini
                      </label>
                      <input
                        type="text"
                        placeholder="Isi dengan nilai saat ini"
                        value={formData.personal_info_change?.current_value || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          personal_info_change: { 
                            field: formData.personal_info_change?.field || '',
                            current_value: e.target.value,
                            new_value: formData.personal_info_change?.new_value || ''
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nilai Baru <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Isi dengan nilai baru"
                        value={formData.personal_info_change?.new_value || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          personal_info_change: { 
                            field: formData.personal_info_change?.field || '',
                            current_value: formData.personal_info_change?.current_value || '',
                            new_value: e.target.value
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.personal_info_new_value ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.personal_info_new_value && (
                        <p className="text-red-500 text-sm mt-1">{errors.personal_info_new_value}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Efektif <span className="text-red-500">*</span>
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
              <p className="text-xs text-gray-500 mt-1">Kapan Anda ingin perubahan ini berlaku</p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Perubahan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan mengapa Anda mengajukan perubahan ini..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{formData.reason.length} / 10 karakter minimum</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link
                href={`/policies/${policyId}`}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Mengirim...' : 'Ajukan Endorsement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
