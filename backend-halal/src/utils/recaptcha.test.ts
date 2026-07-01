import { verifyRecaptcha } from "./recaptcha";

const originalFetch = global.fetch;
const originalEnv = { ...process.env };

afterEach(() => {
  global.fetch = originalFetch;
  process.env = { ...originalEnv };
  jest.restoreAllMocks();
});

describe("verifyRecaptcha", () => {
  it("bypasses verification in dev when secret is unset", async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    process.env.NODE_ENV = "development";
    const res = await verifyRecaptcha("any");
    expect(res.success).toBe(true);
    expect(res.reason).toBe("dev-bypass");
  });

  it("fails closed in production when secret is unset", async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    process.env.NODE_ENV = "production";
    const res = await verifyRecaptcha("any");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("recaptcha-not-configured");
  });

  it("returns missing-token when secret is set but token is empty", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    const res = await verifyRecaptcha(undefined);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("missing-token");
  });

  it("rejects when Google returns success=false", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
    }) as unknown as typeof fetch;

    const res = await verifyRecaptcha("bad");
    expect(res.success).toBe(false);
    expect(res.reason).toContain("invalid-input-response");
  });

  it("rejects low-score responses", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    process.env.RECAPTCHA_MIN_SCORE = "0.5";
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, score: 0.2, action: "contact" }),
    }) as unknown as typeof fetch;

    const res = await verifyRecaptcha("t", "contact");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("low-score");
    expect(res.score).toBe(0.2);
  });

  it("rejects on action mismatch", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, score: 0.9, action: "login" }),
    }) as unknown as typeof fetch;

    const res = await verifyRecaptcha("t", "contact");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("action-mismatch");
  });

  it("accepts a good response", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, score: 0.9, action: "contact" }),
    }) as unknown as typeof fetch;

    const res = await verifyRecaptcha("t", "contact");
    expect(res.success).toBe(true);
    expect(res.score).toBe(0.9);
  });

  it("returns verify-failed when fetch throws", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "s";
    global.fetch = jest.fn().mockRejectedValue(new Error("dns")) as unknown as typeof fetch;
    const res = await verifyRecaptcha("t");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("verify-failed");
  });
});
