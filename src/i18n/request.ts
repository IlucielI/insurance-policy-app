import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'id'
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value || 'id'

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
