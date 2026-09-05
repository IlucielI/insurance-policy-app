'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Home() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                {t('home.hero.viewProducts')}
              </Link>
              <Link 
                href="/products" 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                {t('home.hero.calculatePremium')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('home.products.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: t('home.products.life.title'),
              description: t('home.products.life.description'),
              icon: '💙',
              features: [
                t('home.products.life.features.deathBenefit'),
                t('home.products.life.features.flexiblePremium'),
                t('home.products.life.features.cashValue')
              ]
            },
            {
              title: t('home.products.health.title'),
              description: t('home.products.health.description'),
              icon: '🏥',
              features: [
                t('home.products.health.features.inpatient'),
                t('home.products.health.features.outpatient'),
                t('home.products.health.features.medicine')
              ]
            },
            {
              title: t('home.products.vehicle.title'),
              description: t('home.products.vehicle.description'),
              icon: '🚗',
              features: [
                t('home.products.vehicle.features.allRisk'),
                t('home.products.vehicle.features.tlo'),
                t('home.products.vehicle.features.thirdParty')
              ]
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
                {t('home.products.viewDetail')} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.howItWorks.title')}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: t('home.howItWorks.step1.title'), desc: t('home.howItWorks.step1.description') },
              { step: '2', title: t('home.howItWorks.step2.title'), desc: t('home.howItWorks.step2.description') },
              { step: '3', title: t('home.howItWorks.step3.title'), desc: t('home.howItWorks.step3.description') },
              { step: '4', title: t('home.howItWorks.step4.title'), desc: t('home.howItWorks.step4.description') }
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
          <h2 className="text-4xl font-bold text-center mb-4">{t('home.whyChooseUs.title')}</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {t('home.whyChooseUs.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.instant.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.instant.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.aiPowered.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.aiPowered.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.transparent.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.transparent.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.support.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.support.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.flexible.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.flexible.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.whyChooseUs.fastClaim.title')}</h3>
              <p className="text-gray-600">{t('home.whyChooseUs.fastClaim.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">{t('home.faq.title')}</h2>
          
          <div className="space-y-4">
            {['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map((q, i) => (
              <details key={i} className="bg-white p-6 rounded-xl shadow-sm group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  {t(`home.faq.${q}.question`)}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">
                  {t(`home.faq.${q}.answer`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors text-lg">
              {t('home.cta.viewAllProducts')}
            </Link>
            <Link href="/chat" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg">
              {t('home.cta.chatWithAI')}
            </Link>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            {t('home.cta.features')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>{t('home.footer.copyright')}</p>
          <p className="text-sm mt-2">{t('home.footer.credits')}</p>
        </div>
      </footer>
    </div>
  )
}
