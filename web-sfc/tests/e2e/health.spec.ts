import { expect, test } from "@playwright/test";

test("frontend health endpoint reports uptime", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(typeof body.uptimeSeconds).toBe("number");
});
