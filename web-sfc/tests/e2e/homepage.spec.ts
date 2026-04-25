import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("loads without console errors and renders hero", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);

    // Some content should be rendered (heading or hero image).
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();

    // Filter out noise from third-party scripts (GTM, reCAPTCHA) that may warn
    // about missing config in local dev.
    const appErrors = errors.filter(
      (e) => !/gtm|recaptcha|google/i.test(e)
    );
    expect(appErrors).toEqual([]);
  });

  test("responds with strict security headers", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["strict-transport-security"]).toContain("max-age");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
  });
});
