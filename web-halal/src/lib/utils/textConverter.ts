import { slug } from "github-slugger";
import { marked } from "marked";

// slugify
export const slugify = (content: string) => {
  return slug(content);
};

// Centralised sanitiser config. Allows common markdown output tags but
// strips scripts, iframes, on* handlers and javascript: URLs.
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "a", "abbr", "b", "blockquote", "br", "code", "del", "div", "em",
    "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
    "i", "img", "ins", "kbd", "li", "mark", "ol", "p", "pre", "q", "s",
    "small", "span", "strong", "sub", "sup", "table", "tbody", "td",
    "tfoot", "th", "thead", "tr", "u", "ul",
  ],
  ALLOWED_ATTR: [
    "href", "title", "alt", "src", "class", "id", "target", "rel",
    "width", "height", "loading",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|ftp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

// Lazy require — isomorphic-dompurify pulls in jsdom, which breaks Vercel's
// serverless bundling for dynamically-rendered routes (ERR_REQUIRE_ESM on a
// transitive dependency) if loaded eagerly. Deferring the require means
// pages that only need humanize()/plainify() from this module (no markdown
// rendering) never trigger it.
export const sanitize = (html: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("isomorphic-dompurify");
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
};

// markdownify — parses markdown and returns a React-safe dangerouslySetInnerHTML
// payload. All output is sanitised via DOMPurify, so callers cannot inject
// <script>, on* handlers or javascript: URLs regardless of the input source
// (Strapi richtext, static content, etc.).
export const markdownify = (content: string, div?: boolean) => {
  if (!content) return { __html: "" };
  const rendered = div
    ? (marked.parse(content) as string)
    : (marked.parseInline(content) as string);
  return { __html: sanitize(rendered) };
};

// humanize
export const humanize = (content: string) => {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/[-\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// titleify
export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// plainify
export const plainify = (content: string) => {
  const parseMarkdown: any = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string) => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    }
  );
  return htmlWithoutEntities;
};
