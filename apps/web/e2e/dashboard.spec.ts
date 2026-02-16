import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('deve exibir página de dashboard', async ({ page }) => {
    await page.goto('/')
    // Verifica elementos do dashboard FinControl
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByText(/saldo total/i)).toBeVisible()
  })
})
