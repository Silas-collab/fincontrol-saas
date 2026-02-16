import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('usuário pode fazer login com credenciais válidas', async ({ page }) => {
    // Gerar email único para teste
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123456!';
    
    // Primeiro, registrar um usuário
    await page.goto('http://localhost:3001/register');
    await page.waitForSelector('text=Criar Conta');
    
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    
    await page.click('button[type="submit"]');
    
    // Deve redirecionar para dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('usuário pode fazer logout', async ({ page }) => {
    // Login primeiro
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Logout
    await page.click('button[title="Sair"]');
    
    // Deve redirecionar para login
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page.locator('text=Entrar')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('dashboard mostra saldo total', async ({ page }) => {
    await expect(page.locator('text=Saldo Total')).toBeVisible();
    await expect(page.locator('text=R$')).toBeVisible();
  });

  test('dashboard mostra receitas e despesas', async ({ page }) => {
    await expect(page.locator('text=Receitas')).toBeVisible();
    await expect(page.locator('text=Despesas')).toBeVisible();
  });
});
