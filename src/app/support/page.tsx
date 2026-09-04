'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: string
}

interface ContactMethod {
  icon: string
  title: string
  info: string
  hours: string
  action: string
  link?: string
}

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    policy_number: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { id: 'all', label: 'Semua', icon: '📋' },
    { id: 'policy', label: 'Polis', icon: '📄' },
    { id: 'claim', label: 'Klaim', icon: '💰' },
    { id: 'payment', label: 'Pembayaran', icon: '💳' },
    { id: 'account', label: 'Akun', icon: '👤' }
  ]

  const faqs: FAQItem[] = [
    {
      category: 'policy',
      question: 'Bagaimana cara mengajukan endorsement pada polis saya?',
      answer: 'Anda dapat mengajukan endorsement melalui halaman detail polis Anda. Klik "Endorsement" dan isi form perubahan yang diinginkan. Perubahan akan diproses dalam 3-5 hari kerja. Beberapa perubahan mungkin memerlukan medical check-up ulang.'
    },
    {
      category: 'policy',
      question: 'Apa yang terjadi jika saya melewatkan pembayaran premi?',
      answer: 'Anda memiliki grace period 30 hari untuk membayar premi yang tertunggak tanpa kehilangan perlindungan. Setelah itu, polis akan lapsed. Anda masih dapat mereaktivasi polis dalam 6 bulan dengan membayar premi tertunggak dan mungkin perlu medical check-up ulang.'
    },
    {
      category: 'policy',
      question: 'Apakah saya bisa membatalkan polis dan mendapat refund?',
      answer: 'Ya, dalam 14 hari pertama sejak polis aktif (cooling-off period), Anda berhak mendapat refund 100%. Setelah itu, refund dihitung secara pro-rata dengan pemotongan biaya administrasi 10%. Gunakan halaman Pembatalan Polis untuk mengajukan.'
    },
    {
      category: 'policy',
      question: 'Bagaimana cara menambah atau mengubah ahli waris?',
      answer: 'Masuk ke halaman detail polis Anda, klik "Endorsement", lalu pilih "Perubahan Ahli Waris". Anda dapat menambah, mengubah, atau menghapus ahli waris. Total persentase harus 100%.'
    },
    {
      category: 'claim',
      question: 'Berapa lama proses klaim saya?',
      answer: 'Klaim sederhana diproses dalam 7-14 hari kerja. Klaim kompleks yang memerlukan investigasi dapat memakan waktu hingga 30 hari. Anda akan menerima update status secara berkala via email dan SMS.'
    },
    {
      category: 'claim',
      question: 'Dokumen apa saja yang diperlukan untuk klaim?',
      answer: 'Dokumen dasar: KTP, formulir klaim, dan bukti kejadian. Untuk klaim kesehatan: surat keterangan dokter, kuitansi, resume medis. Untuk klaim kendaraan: laporan polisi, foto kerusakan, estimasi perbaikan. Untuk klaim jiwa: akta kematian, surat keterangan dokter, KTP ahli waris.'
    },
    {
      category: 'claim',
      question: 'Apakah saya bisa mengajukan klaim secara online?',
      answer: 'Ya, semua klaim dapat diajukan secara online melalui portal ini. Upload dokumen dalam format PDF, JPG, atau PNG (max 5MB per file). Anda juga dapat melacak status klaim real-time.'
    },
    {
      category: 'claim',
      question: 'Apa yang harus dilakukan jika klaim saya ditolak?',
      answer: 'Anda akan menerima surat penolakan dengan alasan detail. Jika Anda tidak setuju, ajukan banding dalam 30 hari dengan dokumen pendukung tambahan. Anda juga dapat menghubungi customer service untuk klarifikasi.'
    },
    {
      category: 'payment',
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menerima transfer bank, kartu kredit/debit, e-wallet (GoPay, OVO, Dana), dan virtual account. Untuk premi berkala, Anda dapat mengaktifkan auto-debit untuk kemudahan.'
    },
    {
      category: 'payment',
      question: 'Apakah ada diskon untuk pembayaran tahunan?',
      answer: 'Ya, pembayaran tahunan memberikan harga terbaik (0% markup). Pembayaran semi-annual +2%, quarterly +4%, dan monthly +6%. Kami juga menawarkan diskon 5% untuk pembelian multi-tahun (2+ tahun).'
    },
    {
      category: 'payment',
      question: 'Bagaimana cara mengubah metode pembayaran?',
      answer: 'Masuk ke Pengaturan Profil > Pembayaran, lalu update metode pembayaran Anda. Perubahan akan berlaku untuk pembayaran berikutnya. Jika menggunakan auto-debit, pastikan saldo mencukupi pada tanggal jatuh tempo.'
    },
    {
      category: 'account',
      question: 'Bagaimana cara mengaktifkan Two-Factor Authentication?',
      answer: 'Masuk ke Pengaturan Profil > Keamanan, lalu aktifkan toggle 2FA. Anda akan menerima kode verifikasi via SMS atau email setiap kali login. Ini menambah lapisan keamanan ekstra untuk akun Anda.'
    },
    {
      category: 'account',
      question: 'Saya lupa password, bagaimana cara reset?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email Anda. Anda akan menerima link reset password. Link valid selama 1 jam. Jika tidak menerima email, cek folder spam atau hubungi customer service.'
    },
    {
      category: 'account',
      question: 'Bagaimana cara mengubah informasi pribadi?',
      answer: 'Masuk ke Pengaturan Profil > Informasi Pribadi. Update data Anda dan klik Simpan. Perubahan tertentu (seperti nama atau NIK) mungkin memerlukan verifikasi dokumen tambahan.'
    }
  ]

  const contactMethods: ContactMethod[] = [
    {
      icon: '📞',
      title: 'Customer Service Hotline',
      info: '1500-123 (24/7)',
      hours: 'Tersedia 24 jam setiap hari',
      action: 'Hubungi Sekarang',
      link: 'tel:1500123'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      info: 'Chat dengan agent kami',
      hours: 'Senin-Jumat: 08:00-20:00 WIB',
      action: 'Mulai Chat',
      link: '/chat'
    },
    {
      icon: '📧',
      title: 'Email',
      info: 'support@insurance.com',
      hours: 'Respon dalam 1x24 jam',
      action: 'Kirim Email',
      link: 'mailto:support@insurance.com'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      info: '+62 812-1500-123',
      hours: 'Senin-Jumat: 08:00-17:00 WIB',
      action: 'Chat WhatsApp',
      link: 'https://wa.me/628121500123'
    },
    {
      icon: '🏢',
      title: 'Kantor Cabang',
      info: 'Temukan kantor terdekat',
      hours: 'Senin-Jumat: 09:00-17:00 WIB',
      action: 'Lihat Lokasi'
    },
    {
      icon: '📲',
      title: 'Social Media',
      info: '@insurance_id',
      hours: 'Instagram, Twitter, Facebook',
      action: 'Kunjungi'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('http://localhost:8080/api/v1/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contactForm)
      })

      if (res.ok) {
        alert('Pesan Anda berhasil dikirim! Tim kami akan menghubungi Anda segera.')
        setContactForm({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: '',
          policy_number: ''
        })
      } else {
        throw new Error('Submit failed')
      }
    } catch (err) {
      console.error('Failed to submit contact form:', err)
      alert('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
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
              <Link href="/support" className="text-blue-600 font-medium">
                Bantuan
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                Profil
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">🆘 Pusat Bantuan</h1>
          <p className="text-xl mb-8 text-blue-100">
            Kami siap membantu Anda 24/7. Temukan jawaban atau hubungi kami.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pertanyaan atau topik bantuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">⚡ Aksi Cepat</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/claims/new"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">💰</div>
              <p className="font-semibold">Ajukan Klaim</p>
            </Link>
            <Link
              href="/policies"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">📄</div>
              <p className="font-semibold">Lihat Polis</p>
            </Link>
            <Link
              href="/billing"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">💳</div>
              <p className="font-semibold">Bayar Premi</p>
            </Link>
            <Link
              href="/documents"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">📎</div>
              <p className="font-semibold">Download Dokumen</p>
            </Link>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📞 Hubungi Kami</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{method.info}</p>
                <p className="text-sm text-gray-600 mb-4">{method.hours}</p>
                {method.link ? (
                  <a
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    {method.action}
                  </a>
                ) : (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    {method.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">❓ Pertanyaan yang Sering Diajukan (FAQ)</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600">Tidak ada FAQ yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <div className="text-2xl flex-shrink-0">
                      {expandedFAQ === i ? '−' : '+'}
                    </div>
                  </button>
                  {expandedFAQ === i && (
                    <div className="px-6 pb-4 text-gray-700 border-t border-gray-200 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2">✉️ Kirim Pesan</h2>
            <p className="text-gray-600 mb-6">
              Tidak menemukan jawaban? Kirim pesan dan tim kami akan merespon dalam 1x24 jam.
            </p>

            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="policy">Pertanyaan Polis</option>
                    <option value="claim">Pertanyaan Klaim</option>
                    <option value="payment">Pertanyaan Pembayaran</option>
                    <option value="technical">Masalah Teknis</option>
                    <option value="complaint">Keluhan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Polis (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="POL-2026-XXXXXX"
                    value={contactForm.policy_number}
                    onChange={(e) => setContactForm({ ...contactForm, policy_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Jelaskan pertanyaan atau masalah Anda secara detail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-lg mb-2">Panduan Pengguna</h3>
            <p className="text-sm text-gray-600 mb-4">
              Tutorial lengkap cara menggunakan portal asuransi
            </p>
            <a href="#" className="text-blue-600 font-medium hover:underline text-sm">
              Lihat Panduan →
            </a>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-semibold text-lg mb-2">Edukasi Asuransi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pelajari lebih lanjut tentang produk dan manfaat asuransi
            </p>
            <a href="#" className="text-green-600 font-medium hover:underline text-sm">
              Mulai Belajar →
            </a>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-lg mb-2">Syarat & Ketentuan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Baca kebijakan privasi dan syarat layanan kami
            </p>
            <a href="#" className="text-amber-600 font-medium hover:underline text-sm">
              Baca Selengkapnya →
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Insurance Policy System. All rights reserved. | Customer Service: 1500-123 (24/7)
          </p>
        </div>
      </footer>
    </div>
  )
}
