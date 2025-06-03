import { test, expect } from '@playwright/test'

test('homepage has guestbook title and sign-in button', async ({ page }) => {
  await page.goto('/')

  const heading = page.getByRole('heading', { name: 'Guestbook' })
  await expect(heading).toBeVisible()
  const signInButton = page.getByRole('button', { name: 'Sign in with GitHub' })
  await expect(signInButton).toBeVisible()

  const metaDescription = page.locator('head meta[name="description"]')
  await expect(metaDescription).toHaveAttribute('content', /guestbook/i)
})

test('should have appropriate layout and styling', async ({ page }) => {
  await page.goto('/')

  const mainContainer = page.locator('main')
  await expect(mainContainer).toHaveClass(/flex/)

  const body = page.locator('body')
  await expect(body).toHaveClass(/dark:bg-gray-900/)
})
