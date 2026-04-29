import { test, expect } from '@playwright/test';

test('Full Presentation Flow', async ({ page }) => {
  // 1. สาธิตการใช้งานปุ่มเปิด/ปิดรหัสผ่าน (รูปตา)
  await page.goto('/login');
  await page.waitForTimeout(1500); // พักให้คนดูเห็นหน้าจอแรก

  const passwordInput = page.locator('input[placeholder="Password"]');
  await passwordInput.fill('mysecret');
  await page.waitForTimeout(1000);

  // กดปุ่มรูปตา
  await page.locator('.relative.w-full button').click();
  await page.waitForTimeout(2000); // พักให้คนดูเห็นว่ารหัสแสดงเป็นข้อความ

  // 2. สาธิตการ Login ด้วยข้อมูลจริง
  // เคลียร์ค่ารหัสผ่านเก่า
  await passwordInput.fill('');
  // กดปิดตาคืน
  await page.locator('.relative.w-full button').click();
  await page.waitForTimeout(1000);

  // กรอก Email
  await page.fill('input[placeholder="Email"]', 'peach@gmail.com');
  await page.waitForTimeout(1000);

  // กรอก Password
  await page.fill('input[placeholder="Password"]', '123456');
  await page.waitForTimeout(1000);

  // กดปุ่ม Login
  await page.locator('button:text-is("Login")').click();

  // 3. ไปที่หน้า Welcome
  await expect(page).toHaveURL(/.*\/welcome/, { timeout: 5000 });
  await page.waitForTimeout(2500); // พักดูหน้าทักทาย

  // 4. กด Get Started เพื่อไปหน้า Home
  await page.locator('button:text-is("Get Started")').click();

  // 5. เข้าสู่หน้า Home และรอ Premium Modal
  await expect(page).toHaveURL('http://localhost:5173/', { timeout: 5000 });
  await page.waitForTimeout(2500); // พักให้คนดูเห็นหน้าหลัก ก่อน Modal เด้ง

  const premiumText = page.locator('text=PREMIUM MEMBERSHIP');
  await expect(premiumText).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(2000); // พักให้คนดูอ่าน Modal

  // 6. กดปุ่ม START MY FREE TRIAL เพื่อปิด Modal
  await page.locator('button:has-text("START MY FREE TRIAL")').click();
  await page.waitForTimeout(1500);

  // Modal ควรจะหายไปแล้วเหลือแค่หน้า Home
  await expect(premiumText).not.toBeVisible();
  await page.waitForTimeout(3000); // ค้างหน้าจอไว้ตอนจบก่อนวิดีโอตัด
});
