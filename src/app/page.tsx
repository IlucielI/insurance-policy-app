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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Masih Ada Pertanyaan?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Chat dengan AI Assistant kami untuk mendapatkan informasi lengkap tentang produk, 
          premi, dan cara pengajuan.
        </p>
        <Link 
          href="/chat" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          💬 Chat Sekarang
        </Link>
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
