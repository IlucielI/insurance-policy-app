'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Modal,
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from '@/components/ui'
import DarkModeToggle from '@/components/ui/DarkModeToggle'

export default function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue) {
      setInputError('Field ini wajib diisi')
      return
    }
    setInputError('')
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Design System Showcase
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Komponen UI konsisten untuk Insurance App
            </p>
          </div>
          <DarkModeToggle />
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Berbagai variant dan ukuran button</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="primary" size="md">Primary Medium</Button>
                <Button variant="primary" size="lg">Primary Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading>Loading...</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Form input dengan berbagai state</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                helperText="Nama sesuai KTP"
              />
              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                error={inputError}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                disabled
              />
              <Button type="submit" variant="primary">
                Submit Form
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="default" hoverable>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card dengan border dan background putih
              </p>
            </CardContent>
          </Card>

          <Card variant="outlined" hoverable>
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card dengan border tebal tanpa background
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" hoverable>
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card dengan shadow untuk emphasis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
            <CardDescription>Berbagai ukuran spinner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" text="Loading..." />
              <LoadingSpinner size="lg" text="Memuat data..." />
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 2000)
                }}
              >
                Show Full Screen Loader
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              }
              title="Belum ada data"
              description="Mulai dengan membuat data pertama Anda"
              action={{
                label: 'Buat Baru',
                onClick: () => alert('Create action')
              }}
            />
          </CardContent>
        </Card>

        {/* Error State */}
        <Card>
          <CardHeader>
            <CardTitle>Error State</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorState
              title="Gagal memuat data"
              message="Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi."
              retry={() => alert('Retry action')}
            />
          </CardContent>
        </Card>

        {/* Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Dialog popup dengan berbagai ukuran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Open Modal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Form Submitted"
        description="Data Anda berhasil disimpan"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Email: <strong>{inputValue}</strong>
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Tutup
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              OK
            </Button>
          </div>
        </div>
      </Modal>

      {/* Full Screen Loader */}
      {loading && <LoadingSpinner size="xl" text="Memuat..." fullScreen />}
    </div>
  )
}
