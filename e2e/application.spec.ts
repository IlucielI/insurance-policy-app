import { test, expect } from '@playwright/test'

test.describe('Application Submission', () => {
  test('should display application form', async ({ page }) => {
    await page.goto('/application?product=1&premium=500000')
    
    await expect(page.getByText(/formulir pengajuan/i)).toBeVisible()
  })

  test('should show step progression', async ({ page }) => {
    await page.goto('/application?product=1&premium=500000')
    
    await expect(page.getByText(/data diri/i)).toBeVisible()
    await expect(page.getByText(/kesehatan & pembayaran/i)).toBeVisible()
  })

  test('should fill personal data form', async ({ page }) => {
    await page.goto('/application?product=1&premium=500000')
    
    await page.getByLabel(/nama lengkap/i).fill('John Doe')
    await page.getByLabel(/^email/i).fill('john@example.com')
    await page.getByLabel(/nomor telepon/i).fill('08123456789')
    await page.getByLabel(/tanggal lahir/i).fill('1990-01-01')
    await page.getByLabel(/nomor ktp/i).fill('1234567890123456')
    await page.getByLabel(/alamat lengkap/i).fill('Jakarta, Indonesia')
    
    await page.getByRole('button', { name: /lanjut/i }).click()
    
    // Should proceed to step 2
    await expect(page.getByLabel(/pekerjaan/i)).toBeVisible({ timeout: 5000 })
  })

  test('should complete application submission', async ({ page }) => {
    await page.goto('/application?product=1&premium=500000')
    
    // Step 1
    await page.getByLabel(/nama lengkap/i).fill('John Doe')
    await page.getByLabel(/^email/i).fill('john@example.com')
    await page.getByLabel(/nomor telepon/i).fill('08123456789')
    await page.getByLabel(/tanggal lahir/i).fill('1990-01-01')
    await page.getByLabel(/nomor ktp/i).fill('1234567890123456')
    await page.getByLabel(/alamat lengkap/i).fill('Jakarta, Indonesia')
    await page.getByRole('button', { name: /lanjut/i }).click()
    
    // Step 2
    await page.getByLabel(/pekerjaan/i).fill('Software Engineer')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: /ajukan sekarang/i }).click()
    
    // Should show success or redirect
    await page.waitForURL(url => url.pathname !== '/application', { timeout: 10000 })
  })
})
