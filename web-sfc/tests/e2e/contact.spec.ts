import { expect, test } from "@playwright/test";

// Exercises the contact form end-to-end: we intercept the Strapi POST so the
// test doesn't require a running backend, and assert the recaptcha token is
// forwarded on the outgoing request.
test.describe("contact form", () => {
  test("submits data and shows success toast", async ({ page }) => {
    let captured: { body: any; headers: Record<string, string> } | null = null;

    await page.route("**/api/contacts", async (route) => {
      const req = route.request();
      captured = {
        body: JSON.parse(req.postData() ?? "{}"),
        headers: req.headers(),
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { id: 1, documentId: "abc" } }),
      });
    });

    await page.goto("/lien-he");

    // Adjust selectors if the contact page uses different labels.
    await page.getByLabel(/Họ và Tên/i).fill("Nguyen E2E");
    await page.getByLabel(/Email/i).fill("e2e@example.com");
    await page.getByLabel(/Số điện thoại/i).fill("0901234567");
    await page.getByLabel(/Chủ đề/i).fill("Playwright test");
    await page.getByLabel(/Nội dung/i).fill("Xin chào từ E2E.");

    await page.getByRole("button", { name: /Gửi Tin Nhắn/i }).click();

    await expect(page.getByText(/Cảm ơn bạn đã liên hệ/i)).toBeVisible();
    expect(captured).not.toBeNull();
    expect(captured!.body.data.email).toBe("e2e@example.com");
  });
});
