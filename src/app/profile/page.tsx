'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  city: string
  postal_code: string
  id_number: string
  occupation: string
}

interface CommunicationPreferences {
  email_notifications: boolean
  sms_notifications: boolean
  whatsapp_notifications: boolean
  policy_updates: boolean
  claim_updates: boolean
  payment_reminders: boolean
  promotional_offers: boolean
  newsletter: boolean
}

interface SecuritySettings {
  two_factor_enabled: boolean
  biometric_enabled: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'personal' | 'communication' | 'security'>('personal')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState('')
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    postal_code: '',
    id_number: '',
    occupation: ''
  })

  const [communication, setCommunication] = useState<CommunicationPreferences>({
    email_notifications: true,
    sms_notifications: true,
    whatsapp_notifications: false,
    policy_updates: true,
    claim_updates: true,
    payment_reminders: true,
    promotional_offers: false,
    newsletter: false
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_enabled: false,
    biometric_enabled: false
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/user/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setProfile(data.data.profile)
      setCommunication(data.data.communication_preferences)
      setSecurity(data.data.security_settings)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      // Mock data
      setProfile({
        id: '1',
        full_name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+62 812 3456 7890',
        date_of_birth: '1990-05-15',
        address: 'Jl. Sudirman No. 123',
        city: 'Jakarta',
        postal_code: '12190',
        id_number: '3171234567890001',
        occupation: 'Software Engineer'
      })
    } finally {
      setLoading(false)
    }
  }

  const validatePersonalInfo = (): boolean => {
    const newErrors: FormErrors = {}

    if (!profile.full_name || profile.full_name.length < 3) {
      newErrors.full_name = 'Nama lengkap minimal 3 karakter'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!profile.email || !emailRegex.test(profile.email)) {
      newErrors.email = 'Email tidak valid'
    }

    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    if (!profile.phone || !phoneRegex.test(profile.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid'
    }

    if (!profile.date_of_birth) {
      newErrors.date_of_birth = 'Tanggal lahir wajib diisi'
    } else {
      const birthDate = new Date(profile.date_of_birth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 17) {
        newErrors.date_of_birth = 'Usia minimal 17 tahun'
      }
      if (age > 100) {
        newErrors.date_of_birth = 'Tanggal lahir tidak valid'
      }
    }

    if (!profile.address || profile.address.length < 10) {
      newErrors.address = 'Alamat minimal 10 karakter'
    }

    if (!profile.city) {
      newErrors.city = 'Kota wajib diisi'
    }

    if (!profile.postal_code || !/^\d{5}$/.test(profile.postal_code)) {
      newErrors.postal_code = 'Kode pos harus 5 digit'
    }

    if (!profile.id_number || !/^\d{16}$/.test(profile.id_number)) {
      newErrors.id_number = 'NIK harus 16 digit'
    }

    if (!profile.occupation) {
      newErrors.occupation = 'Pekerjaan wajib diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordChange = (): boolean => {
    const newErrors: FormErrors = {}

    if (!passwordForm.current_password) {
      newErrors.current_password = 'Password saat ini wajib diisi'
    }

    if (!passwordForm.new_password || passwordForm.new_password.length < 8) {
      newErrors.new_password = 'Password baru minimal 8 karakter'
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = 'Password tidak cocok'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (passwordForm.new_password && !passwordRegex.test(passwordForm.new_password)) {
      newErrors.new_password = 'Password harus mengandung huruf besar, kecil, dan angka'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePersonalInfo()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:8080/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      })

      if (res.ok) {
        setSuccessMessage('Informasi pribadi berhasil diperbarui')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        throw new Error('Update failed')
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Gagal memperbarui profil. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCommunication = async () => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:8080/api/v1/user/communication-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(communication)
      })

      if (res.ok) {
        setSuccessMessage('Preferensi komunikasi berhasil diperbarui')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        throw new Error('Update failed')
      }
    } catch (err) {
      console.error('Failed to update communication preferences:', err)
      alert('Gagal memperbarui preferensi. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordChange()) {
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:8080/api/v1/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      })

      if (res.ok) {
        setSuccessMessage('Password berhasil diubah')
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        throw new Error('Password change failed')
      }
    } catch (err) {
      console.error('Failed to change password:', err)
      alert('Gagal mengubah password. Periksa password saat ini Anda.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle2FA = async () => {
    const newValue = !security.two_factor_enabled
    setSecurity({ ...security, two_factor_enabled: newValue })
    
    try {
      await fetch('http://localhost:8080/api/v1/user/toggle-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enabled: newValue })
      })
      setSuccessMessage(`Two-Factor Authentication ${newValue ? 'diaktifkan' : 'dinonaktifkan'}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to toggle 2FA:', err)
      setSecurity({ ...security, two_factor_enabled: !newValue })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
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
              <Link href="/policies" className="text-gray-700 hover:text-blue-600 font-medium">
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
              <Link href="/profile" className="text-blue-600 font-medium">
                Profil
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">⚙️ Pengaturan Profil</h1>
            <p className="text-gray-600">Kelola informasi pribadi, preferensi komunikasi, dan keamanan akun Anda</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                👤 Informasi Pribadi
              </button>
              <button
                onClick={() => setActiveTab('communication')}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === 'communication'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                📧 Komunikasi
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                🔒 Keamanan
              </button>
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSavePersonalInfo} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={profile.id_number}
                      onChange={(e) => setProfile({ ...profile, id_number: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.id_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.id_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.id_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pekerjaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.occupation}
                      onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.occupation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.occupation && (
                      <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={profile.postal_code}
                      onChange={(e) => setProfile({ ...profile, postal_code: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.postal_code ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}

            {/* Communication Tab */}
            {activeTab === 'communication' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Metode Notifikasi</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">Terima notifikasi via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.email_notifications}
                        onChange={(e) => setCommunication({ ...communication, email_notifications: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-gray-600">Terima notifikasi via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.sms_notifications}
                        onChange={(e) => setCommunication({ ...communication, sms_notifications: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-gray-600">Terima notifikasi via WhatsApp</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.whatsapp_notifications}
                        onChange={(e) => setCommunication({ ...communication, whatsapp_notifications: e.target.checked })}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Jenis Notifikasi</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Update Polis</p>
                        <p className="text-sm text-gray-600">Perubahan dan perpanjangan polis</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.policy_updates}
                        onChange={(e) => setCommunication({ ...communication, policy_updates: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Update Klaim</p>
                        <p className="text-sm text-gray-600">Status dan progress klaim Anda</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.claim_updates}
                        onChange={(e) => setCommunication({ ...communication, claim_updates: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Pengingat Pembayaran</p>
                        <p className="text-sm text-gray-600">Jatuh tempo premi dan tagihan</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.payment_reminders}
                        onChange={(e) => setCommunication({ ...communication, payment_reminders: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Penawaran Promosi</p>
                        <p className="text-sm text-gray-600">Diskon dan produk baru</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.promotional_offers}
                        onChange={(e) => setCommunication({ ...communication, promotional_offers: e.target.checked })}
                        className="rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-gray-600">Tips kesehatan dan finansial</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communication.newsletter}
                        onChange={(e) => setCommunication({ ...communication, newsletter: e.target.checked })}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={handleSaveCommunication}
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className="font-semibold mb-4">Ubah Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Saat Ini <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.current_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.current_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Baru <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.new_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.new_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter dengan huruf besar, kecil, dan angka</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password Baru <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {saving ? 'Mengubah...' : 'Ubah Password'}
                    </button>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Keamanan Tambahan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-gray-600">Tambahan lapisan keamanan dengan kode verifikasi</p>
                      </div>
                      <button
                        onClick={handleToggle2FA}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          security.two_factor_enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            security.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-500">Biometric Login</p>
                        <p className="text-sm text-gray-400">Fingerprint atau Face ID (Coming Soon)</p>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Manajemen Sesi</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Sesi Aktif</p>
                        <p className="text-sm text-gray-600">Browser saat ini</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Aktif</span>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Logout dari Semua Perangkat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
