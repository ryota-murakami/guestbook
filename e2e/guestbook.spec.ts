import { test, expect } from '@playwright/test';

test('homepage has guestbook title and sign-in button', async ({ page }) => {
  await page.goto('/');
  
  // タイトルがGuestbookを含むことを確認
  await expect(page).toHaveTitle(/Home/);
  
  // アプリの見出しが表示されていることを確認
  const heading = page.getByRole('heading', { name: 'Guestbook' });
  await expect(heading).toBeVisible();
  
  // サインインボタンが表示されていることを確認
  const signInButton = page.getByRole('button', { name: 'Sign in with GitHub' });
  await expect(signInButton).toBeVisible();
  
  // メタデータが正しく設定されていることを確認
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content', /guestbook/i);
});

test('should have appropriate layout and styling', async ({ page }) => {
  await page.goto('/');
  
  // メインコンテナがフレックスレイアウトを使用していることを確認
  const mainContainer = page.locator('main');
  await expect(mainContainer).toHaveClass(/flex/);
  
  // ダークモードのスタイルが適用されていることを確認
  const body = page.locator('body');
  await expect(body).toHaveClass(/dark:bg-gray-900/);
}); 