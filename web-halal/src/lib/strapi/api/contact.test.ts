import { submitContact, type ContactFormData } from "./contact";

const FORM: ContactFormData = {
  name: "Nguyen Van A",
  phoneNumber: "0901234567",
  title: "Tư vấn",
  description: "Xin chào",
  email: "a@example.com",
};

describe("submitContact", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("POSTs JSON body with data + contactStatus=false", async () => {
    const mock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 42, documentId: "x" } }),
    });

    global.fetch = mock;

    const res = await submitContact(FORM);

    expect(mock).toHaveBeenCalledTimes(1);
    const [url, init] = mock.mock.calls[0];
    expect(url).toMatch(/\/api\/contacts$/);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body.data.email).toBe(FORM.email);
    expect(body.data.contactStatus).toBe(false);
    expect(res.data?.id).toBe(42);
    expect(res.error).toBeUndefined();
  });

  it("sends x-recaptcha-token header when token provided", async () => {
    const mock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1, documentId: "x" } }),
    });

    global.fetch = mock;

    await submitContact(FORM, "captcha-abc");
    const init = mock.mock.calls[0][1];
    expect(init.headers["x-recaptcha-token"]).toBe("captcha-abc");
  });

  it("omits the token header when no token is passed", async () => {
    const mock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1, documentId: "x" } }),
    });

    global.fetch = mock;

    await submitContact(FORM);
    const init = mock.mock.calls[0][1];
    expect(init.headers["x-recaptcha-token"]).toBeUndefined();
  });

  it("returns error payload from Strapi on non-2xx", async () => {

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { status: 403, name: "ForbiddenError", message: "bad captcha" },
      }),
    });

    const res = await submitContact(FORM, "bad-token");
    expect(res.data).toBeNull();
    expect(res.error?.status).toBe(403);
    expect(res.error?.message).toMatch(/captcha/i);
  });

  it("returns network error when fetch throws", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("conn refused")) as unknown as typeof fetch;

    const res = await submitContact(FORM);
    expect(res.data).toBeNull();
    expect(res.error?.name).toBe("NetworkError");
  });
});
