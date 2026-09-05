import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page).toHaveTitle(/Insurance/i)
    await expect(page.getByText(/masuk ke akun anda/i)).toBeVisible()
  })

  test('should display login form elements', async ({ page }) => {
    await page.goto('/auth/login')
    
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /masuk dengan google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^masuk$/i })).toBeVisible()
  })

  test('should show demo credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await expect(page.getByText(/demo account/i)).toBeVisible()
    await expect(page.getByText(/user@example.com/)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByRole('link', { name: /daftar sekarang/i }).click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })

  test('should display registration form', async ({ page }) => {
    await page.goto('/auth/register')
    
    await expect(page.getByLabel(/nama lengkap/i)).toBeVisible()
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/nomor telepon/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByLabel(/konfirmasi password/i)).toBeVisible()
  })

  test('should attempt login with demo credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByLabel(/email/i).fill('user@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /^masuk$/i }).click()
    
    // Should redirect (either success or to products page)
    await page.waitForURL(url => url.pathname !== '/auth/login', { timeout: 5000 })
  })
})
