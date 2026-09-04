import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Asuransi yang Transparan & Mudah Dipahami
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Lindungi masa depan Anda dan keluarga dengan produk asuransi yang fleksibel, 
              premi terjangkau, dan proses klaim yang cepat.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Lihat Produk
              </Link>
              <Link 
                href="/products" 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Hitung Premi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Produk Asuransi Kami</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Asuransi Jiwa',
              description: 'Perlindungan finansial untuk keluarga tercinta',
              icon: '💙',
              features: ['Santunan meninggal dunia', 'Premi fleksibel', 'Nilai tunai']
            },
            {
              title: 'Asuransi Kesehatan',
              description: 'Biaya perawatan medis dan rawat inap',
              icon: '🏥',
              features: ['Rawat inap', 'Rawat jalan', 'Obat-obatan']
            },
            {
              title: 'Asuransi Kendaraan',
              description: 'Perlindungan mobil dan motor dari risiko',
              icon: '🚗',
              features: ['All risk', 'TLO', 'Tanggung jawab pihak ketiga']
            }
          ].map((product, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature, j) => (
                  <li key={j} className="text-sm text-gray-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/products" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Lihat Detail →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Mengajukan</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Pilih Produk', desc: 'Browse produk yang sesuai kebutuhan' },
              { step: '2', title: 'Hitung Premi', desc: 'Simulasi premi dengan kalkulator' },
              { step: '3', title: 'Isi Formulir', desc: 'Lengkapi data diri dan kesehatan' },
              { step: '4', title: 'Polis Terbit', desc: 'Bayar dan polis langsung aktif' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Kenapa Memilih Kami?</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Pengalaman asuransi modern dengan teknologi AI dan layanan 24/7
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Proses Instan</h3>
              <p className="text-gray-600">Quote dalam 90 detik, approval dalam 3 menit. Tidak ada paperwork yang rumit.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-600">Chatbot cerdas 24/7, risk assessment otomatis, dan rekomendasi personal.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Harga Terbaik</h3>
              <p className="text-gray-600">Diskon bundle hingga 25%, premi kompetitif, tanpa biaya tersembunyi.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Digital</h3>
              <p className="text-gray-600">Kelola polis dari smartphone, klaim online, dokumen digital semua dalam satu app.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Perlindungan Lengkap</h3>
              <p className="text-gray-600">Coverage komprehensif, dari jiwa, kesehatan, kendaraan, hingga properti.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Support 24/7</h3>
              <p className="text-gray-600">Live chat, email, phone support. Tim kami siap membantu kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Dipercaya oleh Ribuan Customer</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Polis Aktif</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Kepuasan Customer</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">3 Min</div>
              <div className="text-blue-100">Proses Klaim</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Apa Kata Mereka?</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Customer kami berbicara tentang pengalaman mereka
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Proses claim super cepat! Hanya upload foto dan dalam 3 menit sudah disetujui. Gak percaya bisa secepat ini."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  BW
                </div>
                <div className="ml-4">
                  <div className="font-bold">Budi Wijaya</div>
                  <div className="text-sm text-gray-500">Asuransi Kendaraan</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Chatbot AI-nya membantu banget! Bisa tanya apa aja 24/7 dan responnya cepat. Gak perlu nunggu agen."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SL
                </div>
                <div className="ml-4">
                  <div className="font-bold">Siti Lestari</div>
                  <div className="text-sm text-gray-500">Asuransi Kesehatan</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Premi lebih murah 20% dari kompetitor dan coveragenya lebih lengkap. Bundle discount-nya worth it!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  AP
                </div>
                <div className="ml-4">
                  <div className="font-bold">Agus Prasetyo</div>
                  <div className="text-sm text-gray-500">Asuransi Jiwa + Kendaraan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4">Pertanyaan yang Sering Ditanyakan</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Semua yang perlu Anda ketahui tentang asuransi kami
          </p>
          
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Berapa lama proses approval polis asuransi?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Dengan teknologi AI kami, approval bisa dilakukan dalam 3-5 menit untuk aplikasi yang memenuhi kriteria otomatis. 
                Untuk kasus yang memerlukan review manual, proses maksimal 1 hari kerja.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Apakah ada biaya tersembunyi?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Tidak ada! Semua biaya tertera jelas di quote. Premi yang Anda lihat adalah harga final yang harus dibayar, 
                sudah termasuk pajak dan biaya admin.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Bagaimana cara mengajukan klaim?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Sangat mudah! Login ke dashboard Anda, klik "File Claim", upload foto/dokumen, dan submit. 
                Untuk klaim sederhana, AI kami bisa approve dalam 3 menit. Tim kami akan segera menghubungi untuk klaim kompleks.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Apakah bisa bundle beberapa produk asuransi?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Ya! Kami mendorong customer untuk bundle. Diskon bundle bisa mencapai 25% untuk kombinasi 3 produk atau lebih. 
                Misalnya: Jiwa + Kesehatan + Kendaraan = hemat hingga Rp 500.000/tahun.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Bagaimana cara membatalkan polis?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Anda bisa cancel kapan saja tanpa penalty di 14 hari pertama (cooling-off period). 
                Setelah itu, proses cancellation bisa dilakukan melalui dashboard dengan refund prorate sesuai sisa periode polis.
              </p>
            </details>
            
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Apakah data pribadi saya aman?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi tingkat bank (256-bit SSL), 
                compliance dengan regulasi OJK, dan tidak pernah membagikan data Anda ke pihak ketiga tanpa izin.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Siap Melindungi yang Anda Cintai?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Dapatkan quote gratis dalam 90 detik. Tidak perlu kartu kredit. Tidak ada kewajiban.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors text-lg">
              Lihat Semua Produk
            </Link>
            <Link href="/chat" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg">
              Chat dengan AI Assistant
            </Link>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            ✓ Proses 90 detik  ✓ Tanpa biaya tersembunyi  ✓ Support 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Insurance Policy System. Technical Test Project.</p>
          <p className="text-sm mt-2">Bayu Anugerah • PT Logika Sarana Teknologi</p>
        </div>
      </footer>
    </div>
  )
}
