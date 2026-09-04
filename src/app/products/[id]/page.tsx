'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  description: string
  base_premium: number
  coverage_amount: number
  features: string[]
}

interface PremiumCalculation {
  base_premium: number
  age_factor: number
  coverage_factor: number
  total_premium: number
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [age, setAge] = useState('25')
  const [coverage, setCoverage] = useState('500000000')
  const [calculation, setCalculation] = useState<PremiumCalculation | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Mock product data (fallback jika API belum ada data)
    const mockProduct: Product = {
      id: params.id,
      name: 'Asuransi Jiwa Premium',
      category: 'life',
      description: 'Perlindungan finansial komprehensif untuk keluarga tercinta dengan santunan meninggal dunia hingga Rp 5 miliar',
      base_premium: 500000,
      coverage_amount: 500000000,
      features: [
        'Santunan meninggal dunia hingga Rp 5 miliar',
        'Premi fleksibel mulai dari Rp 500rb/bulan',
        'Nilai tunai yang terus bertumbuh',
        'Rider tambahan: penyakit kritis, kecelakaan',
        'Bebas premi jika cacat total tetap',
        'Pencairan klaim maksimal 7 hari kerja'
      ]
    }
    setProduct(mockProduct)
  }, [params.id])

  const calculatePremium = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const response = await fetch(`${apiUrl}/products/${params.id}/calculate-premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(age),
          coverage_amount: parseInt(coverage)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCalculation(data.data)
      } else {
        // Fallback calculation
        const baseAge = parseInt(age)
        const coverageAmt = parseInt(coverage)
        const ageFactor = baseAge < 30 ? 1.0 : baseAge < 40 ? 1.2 : baseAge < 50 ? 1.5 : 2.0
        const coverageFactor = coverageAmt / 500000000
        const totalPremium = Math.floor(500000 * ageFactor * coverageFactor)
        
        setCalculation({
          base_premium: 500000,
          age_factor: ageFactor,
          coverage_factor: coverageFactor,
          total_premium: totalPremium
        })
      }
    } catch (err) {
      // Fallback calculation on network error
      const baseAge = parseInt(age)
      const coverageAmt = parseInt(coverage)
      const ageFactor = baseAge < 30 ? 1.0 : baseAge < 40 ? 1.2 : baseAge < 50 ? 1.5 : 2.0
      const coverageFactor = coverageAmt / 500000000
      const totalPremium = Math.floor(500000 * ageFactor * coverageFactor)
      
      setCalculation({
        base_premium: 500000,
        age_factor: ageFactor,
        coverage_factor: coverageFactor,
        total_premium: totalPremium
      })
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Insurance Policy System
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Kembali ke Produk
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Product Info */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-5xl mb-4">
              {product.category === 'life' ? '💙' : product.category === 'health' ? '🏥' : '🚗'}
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <h2 className="text-xl font-semibold mb-4">Manfaat & Fitur</h2>
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Calculator */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Hitung Premi Anda</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usia Saat Ini
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="65"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan usia"
                />
                <p className="text-xs text-gray-500 mt-1">Usia minimal 18 tahun, maksimal 65 tahun</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uang Pertanggungan
                </label>
                <select
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="500000000">Rp 500 juta</option>
                  <option value="1000000000">Rp 1 miliar</option>
                  <option value="2000000000">Rp 2 miliar</option>
                  <option value="5000000000">Rp 5 miliar</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Pilih jumlah santunan yang diinginkan</p>
              </div>

              <button
                onClick={calculatePremium}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Menghitung...' : 'Hitung Premi'}
              </button>

              {calculation && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-4 text-blue-900">Hasil Perhitungan Premi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premi Dasar</span>
                      <span className="font-medium">Rp {calculation.base_premium.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faktor Usia (x{calculation.age_factor})</span>
                      <span className="font-medium">Rp {(calculation.base_premium * calculation.age_factor).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faktor Pertanggungan (x{calculation.coverage_factor.toFixed(1)})</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-900">Total Premi/Bulan</span>
                        <span className="text-2xl font-bold text-blue-600">
                          Rp {calculation.total_premium.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/application?product=${params.id}&premium=${calculation.total_premium}`)}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Ajukan Sekarang →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
