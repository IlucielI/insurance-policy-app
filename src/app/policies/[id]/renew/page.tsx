'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Policy {
  id: string
  policy_number: string
  product_name: string
  category: string
  status: 'active' | 'expired' | 'lapsed'
  sum_assured: number
  premium: number
  end_date: string
  lapsed_date?: string
  grace_period_end?: string
}

interface FormData {
  renewal_term: string
  payment_method: string
  auto_renew: boolean
  coverage_adjustments: {
    change_sum_assured: boolean
    new_sum_assured?: string
    add_riders: string[]
  }
  medical_questions: {
    hospitalized_last_year: string
    chronic_conditions: string
    lifestyle_changes: string
  }
  payment_plan: 'annual' | 'semi_annual' | 'quarterly' | 'monthly'
}

interface FormErrors {
  [key: string]: string
}

export default function PolicyRenewalPage() {
  const params = useParams()
  const router = useRouter()
  const policyId = params.id as string
  
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    renewal_term: '1',
    payment_method: '',
    auto_renew: false,
    coverage_adjustments: {
      change_sum_assured: false,
      add_riders: []
    },
    medical_questions: {
      hospitalized_last_year: '',
      chronic_conditions: '',
      lifestyle_changes: ''
    },
    payment_plan: 'annual'
  })

  useEffect(() => {
    fetchPolicy()
  }, [policyId])

  useEffect(() => {
    if (policy) {
      calculatePremium()
    }
  }, [formData.renewal_term, formData.payment_plan, formData.coverage_adjustments])

  const fetchPolicy = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setPolicy(data.data)
    } catch (err) {
      console.error('Failed to fetch policy:', err)
      // Mock expired policy
      setPolicy({
        id: policyId,
        policy_number: 'POL-2025-009876',
        product_name: 'Asuransi Jiwa Premium',
        category: 'life',
        status: 'expired',
        sum_assured: 500000000,
        premium: 2750000,
        end_date: '2026-01-15',
        lapsed_date: '2026-02-15',
        grace_period_end: '2026-03-15'
      })
    } finally {
      setLoading(false)
    }
  }

  const calculatePremium = () => {
    if (!policy) return
    
    let basePremium = policy.premium
    const term = parseInt(formData.renewal_term)
    
    // Adjust for coverage changes
    if (formData.coverage_adjustments.change_sum_assured && formData.coverage_adjustments.new_sum_assured) {
      const newSumAssured = parseFloat(formData.coverage_adjustments.new_sum_assured)
      const ratio = newSumAssured / policy.sum_assured
      basePremium = basePremium * ratio
    }
    
    // Add rider costs
    const riderCost = formData.coverage_adjustments.add_riders.length * 150000
    basePremium += riderCost
    
    // Multi-year discount
    if (term > 1) {
      basePremium = basePremium * 0.95 // 5% discount for multi-year
    }
    
    // Payment plan adjustment
    const planMultipliers = {
      annual: 1,
      semi_annual: 1.02,
      quarterly: 1.04,
      monthly: 1.06
    }
    basePremium = basePremium * planMultipliers[formData.payment_plan]
    
    setCalculatedPremium(basePremium * term)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.payment_method) {
      newErrors.payment_method = 'Pilih metode pembayaran'
    }

    if (formData.coverage_adjustments.change_sum_assured) {
      if (!formData.coverage_adjustments.new_sum_assured) {
        newErrors.new_sum_assured = 'Masukkan jumlah pertanggungan baru'
      } else {
        const amount = parseFloat(formData.coverage_adjustments.new_sum_assured)
        if (isNaN(amount) || amount <= 0) {
          newErrors.new_sum_assured = 'Jumlah harus lebih dari 0'
        }
      }
    }

    // Medical questions validation (required for lapsed policies)
    if (policy?.status === 'lapsed') {
      if (!formData.medical_questions.hospitalized_last_year) {
        newErrors.hospitalized = 'Pertanyaan ini wajib dijawab'
      }
      if (!formData.medical_questions.chronic_conditions) {
        newErrors.chronic = 'Pertanyaan ini wajib dijawab'
      }
      if (!formData.medical_questions.lifestyle_changes) {
        newErrors.lifestyle = 'Pertanyaan ini wajib dijawab'
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
      const res = await fetch(`http://localhost:8080/api/v1/policies/${policyId}/renewals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push(`/policies/${policyId}?renewal_success=true`)
      } else {
        throw new Error('Renewal failed')
      }
    } catch (err) {
      console.error('Failed to submit renewal:', err)
      alert('Gagal mengajukan perpanjangan. Silakan coba lagi.')
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

  const getDaysLapsed = () => {
    if (!policy?.lapsed_date) return 0
    const lapsedDate = new Date(policy.lapsed_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lapsedDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isWithinGracePeriod = () => {
    if (!policy?.grace_period_end) return false
    return new Date() < new Date(policy.grace_period_end)
  }

  const riderOptions = [
    'Critical Illness Rider',
    'Accident Rider',
    'Hospital Income Rider',
    'Waiver of Premium',
    'Term Life Rider'
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

  if (policy.status === 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Polis Masih Aktif</h2>
          <p className="text-gray-600 mb-6">
            Polis Anda masih aktif hingga {formatDate(policy.end_date)}. 
            Anda dapat memperpanjang polis 30 hari sebelum tanggal berakhir.
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

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/policies" className="hover:text-blue-600">Polis</Link>
          <span>/</span>
          <Link href={`/policies/${policyId}`} className="hover:text-blue-600">{policy.policy_number}</Link>
          <span>/</span>
          <span className="text-gray-900">Perpanjangan</span>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Status Banner */}
          <div className={`rounded-lg border p-6 mb-6 ${
            policy.status === 'lapsed' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex gap-3">
              <div className="text-3xl">{policy.status === 'lapsed' ? '⚠️' : '⏰'}</div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {policy.status === 'lapsed' ? 'Polis Sudah Lapsed' : 'Polis Kedaluwarsa'}
                </h2>
                <div className="text-sm space-y-1">
                  <p>Tanggal berakhir: <strong>{formatDate(policy.end_date)}</strong></p>
                  {policy.lapsed_date && (
                    <p>Lapsed sejak: <strong>{formatDate(policy.lapsed_date)}</strong> ({getDaysLapsed()} hari yang lalu)</p>
                  )}
                  {isWithinGracePeriod() && policy.grace_period_end && (
                    <p className="text-green-700 font-medium">
                      ✓ Masih dalam grace period hingga {formatDate(policy.grace_period_end)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Policy Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Detail Polis</h3>
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
                <p className="text-gray-600">Uang Pertanggungan</p>
                <p className="font-semibold">{formatCurrency(policy.sum_assured)}</p>
              </div>
              <div>
                <p className="text-gray-600">Premi Terakhir</p>
                <p className="font-semibold">{formatCurrency(policy.premium)}/tahun</p>
              </div>
            </div>
          </div>

          {/* Renewal Notice */}
          {policy.status === 'lapsed' && !isWithinGracePeriod() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Syarat Reaktivasi Polis Lapsed:</p>
                  <ul className="space-y-1">
                    <li>• Medical check-up ulang mungkin diperlukan</li>
                    <li>• Pembayaran premi tertunggak + denda keterlambatan</li>
                    <li>• Review kesehatan terkini</li>
                    <li>• Waiting period baru untuk klaim tertentu</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Renewal Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h3 className="text-xl font-bold">Form Perpanjangan Polis</h3>

            {/* Renewal Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Perpanjangan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.renewal_term}
                onChange={(e) => setFormData({ ...formData, renewal_term: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 Tahun</option>
                <option value="2">2 Tahun (Diskon 5%)</option>
                <option value="3">3 Tahun (Diskon 5%)</option>
                <option value="5">5 Tahun (Diskon 5%)</option>
              </select>
            </div>

            {/* Payment Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cara Pembayaran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'annual', label: 'Tahunan', extra: 'Harga terbaik' },
                  { value: 'semi_annual', label: 'Per 6 Bulan', extra: '+2%' },
                  { value: 'quarterly', label: 'Per 3 Bulan', extra: '+4%' },
                  { value: 'monthly', label: 'Bulanan', extra: '+6%' }
                ].map((plan) => (
                  <label
                    key={plan.value}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      formData.payment_plan === plan.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_plan"
                      value={plan.value}
                      checked={formData.payment_plan === plan.value}
                      onChange={(e) => setFormData({ ...formData, payment_plan: e.target.value as any })}
                      className="mr-2"
                    />
                    <span className="font-medium">{plan.label}</span>
                    <span className="text-xs text-gray-600 ml-2">{plan.extra}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coverage Adjustments */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Penyesuaian Cakupan (Opsional)</h4>
              
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.coverage_adjustments.change_sum_assured}
                    onChange={(e) => setFormData({
                      ...formData,
                      coverage_adjustments: {
                        ...formData.coverage_adjustments,
                        change_sum_assured: e.target.checked
                      }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Ubah Uang Pertanggungan</span>
                </label>

                {formData.coverage_adjustments.change_sum_assured && (
                  <div>
                    <input
                      type="number"
                      placeholder="Jumlah baru (Rp)"
                      value={formData.coverage_adjustments.new_sum_assured || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        coverage_adjustments: {
                          ...formData.coverage_adjustments,
                          new_sum_assured: e.target.value
                        }
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.new_sum_assured ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.new_sum_assured && (
                      <p className="text-red-500 text-sm mt-1">{errors.new_sum_assured}</p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Tambah Rider (Opsional)</p>
                  <div className="space-y-2">
                    {riderOptions.map((rider) => (
                      <label key={rider} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.coverage_adjustments.add_riders.includes(rider)}
                          onChange={(e) => {
                            const current = formData.coverage_adjustments.add_riders
                            const updated = e.target.checked
                              ? [...current, rider]
                              : current.filter(r => r !== rider)
                            setFormData({
                              ...formData,
                              coverage_adjustments: {
                                ...formData.coverage_adjustments,
                                add_riders: updated
                              }
                            })
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{rider}</span>
                        <span className="text-xs text-gray-500">+Rp 150k/tahun</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Questions (for lapsed policies) */}
            {policy.status === 'lapsed' && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Pertanyaan Kesehatan <span className="text-red-500">*</span></h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apakah Anda dirawat di rumah sakit dalam 12 bulan terakhir?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="yes"
                          checked={formData.medical_questions.hospitalized_last_year === 'yes'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              hospitalized_last_year: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Ya</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="no"
                          checked={formData.medical_questions.hospitalized_last_year === 'no'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              hospitalized_last_year: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Tidak</span>
                      </label>
                    </div>
                    {errors.hospitalized && (
                      <p className="text-red-500 text-sm mt-1">{errors.hospitalized}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apakah Anda memiliki kondisi kesehatan kronis?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="chronic"
                          value="yes"
                          checked={formData.medical_questions.chronic_conditions === 'yes'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              chronic_conditions: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Ya</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="chronic"
                          value="no"
                          checked={formData.medical_questions.chronic_conditions === 'no'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              chronic_conditions: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Tidak</span>
                      </label>
                    </div>
                    {errors.chronic && (
                      <p className="text-red-500 text-sm mt-1">{errors.chronic}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apakah ada perubahan signifikan dalam gaya hidup (merokok, pekerjaan berbahaya, dll)?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="lifestyle"
                          value="yes"
                          checked={formData.medical_questions.lifestyle_changes === 'yes'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              lifestyle_changes: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Ya</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="lifestyle"
                          value="no"
                          checked={formData.medical_questions.lifestyle_changes === 'no'}
                          onChange={(e) => setFormData({
                            ...formData,
                            medical_questions: {
                              ...formData.medical_questions,
                              lifestyle_changes: e.target.value
                            }
                          })}
                        />
                        <span className="text-sm">Tidak</span>
                      </label>
                    </div>
                    {errors.lifestyle && (
                      <p className="text-red-500 text-sm mt-1">{errors.lifestyle}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.payment_method ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih metode pembayaran</option>
                <option value="transfer">Transfer Bank</option>
                <option value="credit_card">Kartu Kredit</option>
                <option value="debit_card">Kartu Debit</option>
                <option value="e_wallet">E-Wallet (GoPay, OVO, Dana)</option>
                <option value="virtual_account">Virtual Account</option>
              </select>
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
              )}
            </div>

            {/* Auto-renewal */}
            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.auto_renew}
                  onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                  className="mt-1 rounded"
                />
                <div>
                  <span className="font-medium">Aktifkan Perpanjangan Otomatis</span>
                  <p className="text-sm text-gray-600">
                    Polis akan diperpanjang otomatis sebelum tanggal jatuh tempo dengan metode pembayaran yang sama
                  </p>
                </div>
              </label>
            </div>

            {/* Premium Summary */}
            {calculatedPremium !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Ringkasan Biaya</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Premi dasar ({formData.renewal_term} tahun)</span>
                    <span className="font-medium">{formatCurrency(policy.premium * parseInt(formData.renewal_term))}</span>
                  </div>
                  {formData.coverage_adjustments.add_riders.length > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Rider tambahan ({formData.coverage_adjustments.add_riders.length})</span>
                      <span>+{formatCurrency(150000 * formData.coverage_adjustments.add_riders.length * parseInt(formData.renewal_term))}</span>
                    </div>
                  )}
                  {formData.payment_plan !== 'annual' && (
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya cicilan</span>
                      <span>+{((formData.payment_plan === 'semi_annual' ? 2 : formData.payment_plan === 'quarterly' ? 4 : 6))}%</span>
                    </div>
                  )}
                  {parseInt(formData.renewal_term) > 1 && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon multi-tahun</span>
                      <span>-5%</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-blue-300 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatCurrency(calculatedPremium)}</span>
                  </div>
                </div>
              </div>
            )}

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
                {submitting ? 'Memproses...' : 'Perpanjang Polis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
