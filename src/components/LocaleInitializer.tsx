'use client'

import { useEffect } from 'react'

export default function LocaleInitializer() {
  useEffect(() => {
    // Initialize locale from localStorage or default to 'id'
    const storedLocale = localStorage.getItem('locale')
    if (!storedLocale) {
      localStorage.setItem('locale', 'id')
      document.cookie = 'locale=id; path=/; max-age=31536000'
    } else {
      // Ensure cookie is set
      document.cookie = `locale=${storedLocale}; path=/; max-age=31536000`
    }
  }, [])

  return null
}
