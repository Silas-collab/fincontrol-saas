import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test('deve exibir página de login', async ({ page }) => {
    await page.goto('/login')
    // Verifica logo e título do FinControl
    await expect(page.getByRole('heading', { name: 'FinControl' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /bem-vindo de volta/i })).toBeVisible()
    await expect(page.getByPlaceholder(/seu@email.com/i)).toBeVisible()
  })

  test('deve navegar para página de registro', async ({ page }) => {
    await page.goto('/login')
    // Verifica link para registro
    await expect(page.getByRole('link', { name: /criar conta/i })).toBeVisible()
    await page.getByRole('link', { name: /criar conta/i }).click()
    // Aguarda navegação
    await page.waitForURL('**/register')
    await expect(page.getByRole('heading', { name: 'FinControl' })).toBeVisible()
  })
})
