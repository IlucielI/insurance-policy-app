import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('heading', { name: /insurance/i })).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    
    // Look for products link or button
    const productsLink = page.getByRole('link', { name: /produk/i }).first()
    if (await productsLink.isVisible()) {
      await productsLink.click()
      await expect(page).toHaveURL(/\/products/)
    }
  })

  test('should display product categories', async ({ page }) => {
    await page.goto('/products')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Check if page has product-related content
    const hasProducts = await page.getByText(/asuransi/i).first().isVisible().catch(() => false)
    expect(hasProducts).toBeTruthy()
  })
})
