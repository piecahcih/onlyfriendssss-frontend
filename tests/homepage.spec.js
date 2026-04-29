import { test, expect } from '@playwright/test';

test.describe('HomePage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 1. เข้าสู่ระบบก่อน
    await page.goto('/login');
    await page.fill('input[placeholder="Email"]', 'peach@gmail.com');
    await page.fill('input[placeholder="Password"]', '123456');
    await page.locator('button:text-is("Login")').click();

    // 2. ไปหน้า Welcome และกด Get Started
    await expect(page).toHaveURL(/.*\/welcome/, { timeout: 5000 });
    await page.locator('button:text-is("Get Started")').click();

    // 3. รอโหลดหน้า Home และปิด Premium Modal ก่อนเสมอ
    await expect(page).toHaveURL('http://localhost:5173/', { timeout: 5000 });
    const premiumText = page.locator('text=PREMIUM MEMBERSHIP');
    await expect(premiumText).toBeVisible({ timeout: 5000 });
    
    // กดปุ่ม START MY FREE TRIAL เพื่อปิด
    await page.locator('button:has-text("START MY FREE TRIAL")').click();
    await expect(premiumText).not.toBeVisible();
    await page.waitForTimeout(1000); // พักให้ชัวร์ว่า Modal ปิดแล้ว
  });

  test('ตรวจสอบปุ่ม Like และ Notification ด้านบน', async ({ page }) => {
    // โครงสร้างปุ่มอยู่ด้านบนขวา
    const topButtons = page.locator('.flex.gap-2 button');

    // ทดสอบกดปุ่ม Like
    await topButtons.nth(0).click();
    await page.waitForTimeout(1000); // รอดูว่า Modal ขึ้น
    
    // กดปุ่มปิด Like Modal (ปุ่มใน header)
    await page.locator('header button').first().click();
    await page.waitForTimeout(1000);

    // ทดสอบกดปุ่ม Notification
    await topButtons.nth(1).click();
    await page.waitForTimeout(1000); // รอดู Notification Modal
    
    // กดปุ่มปิด Notification Modal (ปุ่มใน header)
    const notiHeader = page.locator('h1', { hasText: 'Notifications' });
    await expect(notiHeader).toBeVisible();
    await page.locator('header button').first().click();
    await page.waitForTimeout(1000);
  });

  test('ตรวจสอบ Upcoming Activities (เข้าและออก)', async ({ page }) => {
    // หา Upcoming card (เป็น a tag ที่มี href ไปที่ /activity-details)
    const upcomingCards = page.locator('a[href^="/activity-details"]').first();
    
    if (await upcomingCards.isVisible()) {
        await upcomingCards.click();
        await expect(page).toHaveURL(/.*\/activity-details.*/, { timeout: 5000 });
        await page.waitForTimeout(1500); // พักดูหน้ารายละเอียด
        await page.goBack(); // กดย้อนกลับ
        await expect(page).toHaveURL('http://localhost:5173/', { timeout: 5000 });
        await page.waitForTimeout(1000);
    }
  });

  test('ตรวจสอบ Friend\'s Activities (See More และเข้าดู)', async ({ page }) => {
    // 1. กดดู "See More >" 
    const seeMoreBtn = page.locator('button', { hasText: 'See More' });
    if (await seeMoreBtn.isVisible()) {
        await seeMoreBtn.click();
        await expect(page).toHaveURL(/.*\/all-friend-activities/, { timeout: 5000 });
        await page.waitForTimeout(1500);
        await page.goBack();
    }

    // 2. กดดูกิจกรรมเพื่อน (กล่องพื้นหลังสีขาวมี .bg-white.p-4)
    // อาศัย CSS class ที่เห็นในหน้า HomePage
    const friendActivity = page.locator('.bg-white.p-4.rounded-\\[20px\\]').first();
    if (await friendActivity.isVisible()) {
        await friendActivity.click();
        await expect(page).toHaveURL(/.*\/activity-details.*/, { timeout: 5000 });
        await page.waitForTimeout(1500);
        await page.goBack();
    }
  });

  test('ตรวจสอบ Suggested Activities (Explore All กรณีว่าง)', async ({ page }) => {
    // 1. ตรวจสอบว่าถ้าหน้าว่างเปล่า มีปุ่ม Explore All ไหม
    const exploreAllBtn = page.locator('button', { hasText: 'Explore All' });
    if (await exploreAllBtn.isVisible()) {
        await exploreAllBtn.click();
        await page.waitForTimeout(1000);
    }
  });
});
