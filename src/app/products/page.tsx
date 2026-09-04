'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  description: string
  min_sum_assured: number
  max_sum_assured: number
  base_premium_rate: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('is_active', 'true')

      const res = await fetch(`http://localhost:8080/api/v1/products?${params}`)
      const data = await res.json()
      setProducts(data.data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      // Fallback mock data for demo
      setProducts([
        {
          id: '1',
          name: 'Asuransi Jiwa Murni',
          category: 'life',
          description: 'Perlindungan finansial untuk keluarga tercinta dengan santunan meninggal dunia.',
          min_sum_assured: 50000000,
          max_sum_assured: 1000000000,
          base_premium_rate: 0.5
        },
        {
          id: '2',
          name: 'Asuransi Kesehatan Premium',
          category: 'health',
          description: 'Biaya perawatan medis dan rawat inap di rumah sakit seluruh Indonesia.',
          min_sum_assured: 10000000,
          max_sum_assured: 500000000,
          base_premium_rate: 1.2
        },
        {
          id: '3',
          name: 'Asuransi Kendaraan Komprehensif',
          category: 'vehicle',
          description: 'Perlindungan all risk untuk mobil dan motor dari berbagai risiko.',
          min_sum_assured: 50000000,
          max_sum_assured: 500000000,
          base_premium_rate: 2.5
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

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      life: 'Jiwa',
      health: 'Kesehatan',
      vehicle: 'Kendaraan'
    }
    return labels[cat] || cat
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
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Produk
            </Link>
            <Link href="/chat" className="text-gray-700 hover:text-blue-600 font-medium">
              Chat AI
            </Link>
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Produk Asuransi</h1>
        <p className="text-gray-600 mb-8">Pilih produk yang sesuai dengan kebutuhan Anda</p>

        {/* Filter */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setCategory('life')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === 'life' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Jiwa
          </button>
          <button
            onClick={() => setCategory('health')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === 'health' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Kesehatan
          </button>
          <button
            onClick={() => setCategory('vehicle')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === 'vehicle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Kendaraan
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">Tidak ada produk yang tersedia</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {getCategoryLabel(product.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.base_premium_rate}% rate
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Jumlah Pertanggungan</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(product.min_sum_assured)} - {formatCurrency(product.max_sum_assured)}
                  </p>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Lihat Detail & Hitung Premi
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
