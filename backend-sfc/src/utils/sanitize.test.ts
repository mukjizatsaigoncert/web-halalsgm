import { cleanRichText, sanitizeFields, stripHtml } from "./sanitize";

describe("stripHtml", () => {
  it("removes all HTML tags", () => {
    expect(stripHtml("<p>hi <b>there</b></p>")).toBe("hi there");
  });
  it("removes script content entirely", () => {
    expect(stripHtml("safe<script>alert(1)</script>text")).toBe("safetext");
  });
  it("passes through non-strings unchanged", () => {
    expect(stripHtml(42 as unknown as string)).toBe(42);
  });
});

describe("cleanRichText", () => {
  it("keeps common safe tags", () => {
    const out = cleanRichText("<h2>T</h2><p><strong>ok</strong></p>");
    expect(out).toContain("<h2>T</h2>");
    expect(out).toContain("<strong>ok</strong>");
  });
  it("strips script tags", () => {
    expect(cleanRichText("<p>ok</p><script>x</script>")).not.toMatch(/<script/);
  });
  it("forces rel=noopener on anchors", () => {
    const out = cleanRichText('<a href="https://x.com">go</a>');
    expect(out).toMatch(/rel="noopener noreferrer"/);
  });
  it("drops javascript: URLs", () => {
    const out = cleanRichText('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toMatch(/javascript:/i);
  });
});

describe("sanitizeFields", () => {
  it("mutates only the specified plain fields", () => {
    const obj: any = { a: "<b>bold</b>", b: "<b>kept</b>" };
    sanitizeFields(obj, { plain: ["a"] });
    expect(obj.a).toBe("bold");
    expect(obj.b).toBe("<b>kept</b>");
  });
  it("sanitises rich fields preserving safe tags", () => {
    const obj: any = { body: "<p>x</p><script>bad</script>" };
    sanitizeFields(obj, { rich: ["body"] });
    expect(obj.body).toMatch(/<p>x<\/p>/);
    expect(obj.body).not.toMatch(/script/);
  });
  it("handles undefined data gracefully", () => {
    expect(sanitizeFields(undefined, { plain: ["a"] })).toBeUndefined();
  });
});
