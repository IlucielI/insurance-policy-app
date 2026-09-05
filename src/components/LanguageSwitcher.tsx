'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const getCurrentLocale = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locale') || 'id'
    }
    return 'id'
  }

  const locale = getCurrentLocale()

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // Store in localStorage
      localStorage.setItem('locale', newLocale)
      
      // Set cookie
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
      
      // Refresh to apply new locale
      router.refresh()
    })
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        disabled={isPending}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
      >
        <option value="id">🇮🇩 Indonesia</option>
        <option value="en">🇬🇧 English</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}
