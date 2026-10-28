import { test, expect } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
  await page.goto('/');

  // Expect a title to be present
  await expect(page).toHaveTitle(/Ingata/);

  // Expect navigation to be visible
  const navigation = page.locator('nav');
  await expect(navigation).toBeVisible();
});

test('properties page loads correctly', async ({ page }) => {
  await page.goto('/properties');

  // Expect the page to load
  await expect(page).toHaveURL(/.*properties/);

  // Check for property cards or listings
  const propertySection = page.locator('main');
  await expect(propertySection).toBeVisible();
});

test('can navigate to contact page', async ({ page }) => {
  await page.goto('/');

  // Click on contact link (adjust selector based on actual implementation)
  const contactLink = page.getByRole('link', { name: /contact/i });
  await contactLink.click();

  // Expect to be on contact page
  await expect(page).toHaveURL(/.*contact/);
});
