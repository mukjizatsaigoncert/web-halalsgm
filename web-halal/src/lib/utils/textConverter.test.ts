import { markdownify, sanitize, plainify, slugify, humanize, titleify } from "./textConverter";

describe("sanitize", () => {
  it("strips <script> tags entirely", () => {
    const dirty = '<p>hello</p><script>alert(1)</script>';
    expect(sanitize(dirty)).toBe("<p>hello</p>");
  });

  it("removes on* event handlers", () => {
    const out = sanitize('<img src=x onerror="alert(1)" alt="x">');
    expect(out).not.toMatch(/onerror/i);
  });

  it("blocks javascript: URLs in anchors", () => {
    const out = sanitize('<a href="javascript:alert(1)">click</a>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it("preserves safe tags and http links", () => {
    const out = sanitize('<a href="https://example.com">ok</a>');
    expect(out).toContain('href="https://example.com"');
  });
});

describe("markdownify", () => {
  it("returns empty __html for empty input", () => {
    expect(markdownify("")).toEqual({ __html: "" });
  });

  it("parses inline markdown and sanitises", () => {
    const result = markdownify("**bold** <script>x</script>");
    expect(result.__html).toContain("<strong>bold</strong>");
    expect(result.__html).not.toContain("<script>");
  });

  it("parses block markdown when div=true", () => {
    const result = markdownify("# Title\n\ntext", true);
    expect(result.__html).toMatch(/<h1/);
  });

  it("strips iframes even with div=true", () => {
    const result = markdownify('<iframe src="x"></iframe>paragraph', true);
    expect(result.__html).not.toMatch(/<iframe/i);
  });
});

describe("plainify", () => {
  it("strips markdown + html tags", () => {
    expect(plainify("**hello** <b>world</b>")).toMatch(/hello\s+world/);
  });
});

describe("slugify / humanize / titleify", () => {
  it("slugify lowercases + dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("humanize replaces underscores and dashes", () => {
    expect(humanize("some_thing-else")).toBe("Some thing else");
  });
  it("titleify capitalises each word", () => {
    expect(titleify("hello_world")).toBe("Hello World");
  });
});
