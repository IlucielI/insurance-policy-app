'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Policy {
  id: string
  policy_number: string
  product_name: string
  category: string
}

interface FormData {
  policy_id: string
  claim_type: string
  incident_date: string
  incident_location: string
  description: string
  amount_claimed: string
  police_report_number?: string
  hospital_name?: string
  diagnosis?: string
  documents: File[]
}

interface FormErrors {
  [key: string]: string
}

function NewClaimContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPolicyId = searchParams.get('policy_id')

  const [step, setStep] = useState(1)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<FormData>({
    policy_id: preselectedPolicyId || '',
    claim_type: '',
    incident_date: '',
    incident_location: '',
    description: '',
    amount_claimed: '',
    documents: []
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/policies?status=active', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setPolicies(data.data || [])
    } catch (err) {
      console.error('Failed to fetch policies:', err)
      // Mock data
      setPolicies([
        { id: '1', policy_number: 'POL-2026-001234', product_name: 'Asuransi Jiwa Premium', category: 'life' },
        { id: '2', policy_number: 'POL-2026-001567', product_name: 'Asuransi Kesehatan Plus', category: 'health' },
        { id: '3', policy_number: 'POL-2025-009876', product_name: 'Asuransi Kendaraan Comprehensive', category: 'vehicle' }
      ])
    }
  }

  const getClaimTypes = () => {
    const selectedPolicy = policies.find(p => p.id === formData.policy_id)
    if (!selectedPolicy) return []

    const types: Record<string, string[]> = {
      life: ['Meninggal Dunia', 'Cacat Tetap Total', 'Rawat Inap', 'Penyakit Kritis'],
      health: ['Rawat Inap', 'Rawat Jalan', 'Operasi', 'Obat-obatan', 'Check-up'],
      vehicle: ['Kerusakan Total', 'Kerusakan Parsial', 'Kehilangan', 'Tanggung Jawab Pihak Ketiga']
    }
    return types[selectedPolicy.category] || []
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {}

    if (currentStep === 1) {
      if (!formData.policy_id) newErrors.policy_id = 'Pilih polis terlebih dahulu'
      if (!formData.claim_type) newErrors.claim_type = 'Pilih jenis klaim'
    }

    if (currentStep === 2) {
      if (!formData.incident_date) newErrors.incident_date = 'Tanggal kejadian wajib diisi'
      if (!formData.incident_location) newErrors.incident_location = 'Lokasi kejadian wajib diisi'
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = 'Deskripsi minimal 20 karakter'
      }
      if (!formData.amount_claimed || parseFloat(formData.amount_claimed) <= 0) {
        newErrors.amount_claimed = 'Jumlah klaim harus lebih dari 0'
      }

      // Date validation
      const incidentDate = new Date(formData.incident_date)
      const today = new Date()
      if (incidentDate > today) {
        newErrors.incident_date = 'Tanggal kejadian tidak boleh di masa depan'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData({ ...formData, documents: [...formData.documents, ...files] })
    }
  }

  const removeFile = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index)
    setFormData({ ...formData, documents: newDocs })
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'documents') {
          formData.documents.forEach(file => submitData.append('documents', file))
        } else {
          submitData.append(key, value as string)
        }
      })

      const res = await fetch('http://localhost:8080/api/v1/claims', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: submitData
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/claims/${data.data.id}?success=true`)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      console.error('Failed to submit claim:', err)
      alert('Gagal mengajukan klaim. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount.replace(/[^0-9]/g, ''))
    return isNaN(num) ? '' : new Intl.NumberFormat('id-ID').format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Insurance</Link>
          <nav className="flex gap-6">
            <Link href="/policies" className="text-gray-700 hover:text-blue-600 font-medium">Polis Saya</Link>
            <Link href="/claims" className="text-blue-600 font-medium">Klaim</Link>
            <Link href="/billing" className="text-gray-700 hover:text-blue-600 font-medium">Tagihan</Link>
            <Link href="/documents" className="text-gray-700 hover:text-blue-600 font-medium">Dokumen</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <Link href="/claims" className="text-blue-600 hover:underline">Klaim</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Ajukan Klaim Baru</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Pilih Polis' },
              { num: 2, label: 'Detail Kejadian' },
              { num: 3, label: 'Dokumen' },
              { num: 4, label: 'Review' }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <p className={`text-xs mt-2 ${step >= s.num ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {s.label}
                  </p>
                </div>
                {i < 3 && (
                  <div className={`h-1 flex-1 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Step 1: Select Policy */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Pilih Polis & Jenis Klaim</h2>
              <p className="text-gray-600 mb-6">Pilih polis yang ingin Anda ajukan klaim</p>

              <div className="space-y-6">
                {/* Policy Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Polis Asuransi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.policy_id}
                    onChange={(e) => setFormData({ ...formData, policy_id: e.target.value, claim_type: '' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.policy_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Pilih Polis --</option>
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.policy_number} - {p.product_name}
                      </option>
                    ))}
                  </select>
                  {errors.policy_id && <p className="text-red-500 text-sm mt-1">{errors.policy_id}</p>}
                </div>

                {/* Claim Type Selection */}
                {formData.policy_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Klaim <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {getClaimTypes().map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, claim_type: type })}
                          className={`p-4 border-2 rounded-lg text-left transition ${
                            formData.claim_type === type
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">{type}</p>
                        </button>
                      ))}
                    </div>
                    {errors.claim_type && <p className="text-red-500 text-sm mt-1">{errors.claim_type}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Lanjut →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Incident Details */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Detail Kejadian</h2>
              <p className="text-gray-600 mb-6">Berikan informasi lengkap tentang kejadian yang ingin diklaim</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Kejadian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.incident_date}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.incident_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.incident_date && <p className="text-red-500 text-sm mt-1">{errors.incident_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Klaim (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.amount_claimed}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, amount_claimed: value })
                      }}
                      placeholder="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.amount_claimed ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formData.amount_claimed && (
                      <p className="text-sm text-gray-600 mt-1">Rp {formatCurrency(formData.amount_claimed)}</p>
                    )}
                    {errors.amount_claimed && <p className="text-red-500 text-sm mt-1">{errors.amount_claimed}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.incident_location}
                    onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                    placeholder="Contoh: RS Harapan Kita, Jakarta Barat"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.incident_location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.incident_location && <p className="text-red-500 text-sm mt-1">{errors.incident_location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan secara detail kronologi kejadian, gejala, atau kerusakan yang terjadi..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-sm text-gray-600 mt-1">{formData.description.length} karakter (min. 20)</p>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Additional fields based on claim type */}
                {formData.claim_type.includes('Rawat') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Rumah Sakit</label>
                    <input
                      type="text"
                      value={formData.hospital_name || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                      placeholder="Contoh: RS Harapan Kita"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {formData.claim_type.includes('Kendaraan') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Laporan Polisi</label>
                    <input
                      type="text"
                      value={formData.police_report_number || ''}
                      onChange={(e) => setFormData({ ...formData, police_report_number: e.target.value })}
                      placeholder="Contoh: LP/123/V/2026/POLDA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  ← Kembali
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Lanjut →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Dokumen Pendukung</h2>
              <p className="text-gray-600 mb-6">Upload dokumen yang diperlukan untuk proses klaim</p>

              <div className="space-y-6">
                {/* Required Documents List */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium text-blue-900 mb-2">📋 Dokumen yang diperlukan:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Foto KTP pemegang polis</li>
                    <li>• Formulir klaim (akan dikirim via email)</li>
                    {formData.claim_type.includes('Rawat') && (
                      <>
                        <li>• Surat keterangan dokter</li>
                        <li>• Kuitansi rumah sakit</li>
                        <li>• Resume medis</li>
                      </>
                    )}
                    {formData.claim_type.includes('Kendaraan') && (
                      <>
                        <li>• Laporan polisi</li>
                        <li>• Foto kerusakan</li>
                        <li>• Estimasi biaya perbaikan</li>
                      </>
                    )}
                    <li>• Dokumen pendukung lainnya</li>
                  </ul>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-gray-700 font-medium mb-1">Klik untuk upload file</p>
                      <p className="text-sm text-gray-500">atau drag and drop file ke sini</p>
                      <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (max 5MB per file)</p>
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {formData.documents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">File yang diupload ({formData.documents.length}):</p>
                    <div className="space-y-2">
                      {formData.documents.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(i)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  ← Kembali
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Lanjut →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Review & Kirim Klaim</h2>
              <p className="text-gray-600 mb-6">Periksa kembali informasi klaim Anda sebelum dikirim</p>

              <div className="space-y-6">
                {/* Policy Info */}
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Polis</p>
                  <p className="font-medium text-gray-900">
                    {policies.find(p => p.id === formData.policy_id)?.product_name} 
                    <span className="text-gray-600 text-sm ml-2">
                      ({policies.find(p => p.id === formData.policy_id)?.policy_number})
                    </span>
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Jenis Klaim</p>
                  <p className="font-medium text-gray-900">{formData.claim_type}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Tanggal Kejadian</p>
                  <p className="font-medium text-gray-900">
                    {new Date(formData.incident_date).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Lokasi Kejadian</p>
                  <p className="font-medium text-gray-900">{formData.incident_location}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Jumlah Klaim</p>
                  <p className="font-medium text-blue-600 text-xl">
                    Rp {formatCurrency(formData.amount_claimed)}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Deskripsi</p>
                  <p className="text-gray-900">{formData.description}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Dokumen ({formData.documents.length} file)</p>
                  <div className="space-y-1 mt-2">
                    {formData.documents.map((file, i) => (
                      <p key={i} className="text-sm text-gray-700">• {file.name}</p>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-gray-50 border rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="mt-1" />
                    <span className="text-sm text-gray-700">
                      Saya menyatakan bahwa semua informasi yang diberikan adalah benar dan akurat. 
                      Saya memahami bahwa informasi palsu dapat mengakibatkan penolakan klaim atau 
                      pembatalan polis.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  ← Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      ✓ Kirim Klaim
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat formulir...</p>
        </div>
      </div>
    }>
      <NewClaimContent />
    </Suspense>
  )
}
