const appBaseUrl = new URL("./", window.location.href);
const manifestUrl = new URL("./docs-manifest.json", appBaseUrl);
const contentEl = document.getElementById("docs-content");
const titleEl = document.getElementById("doc-title");
const pathPillEl = document.getElementById("doc-path-pill");
const metaEl = document.getElementById("docs-meta");
const navEl = document.getElementById("docs-nav");
const searchEl = document.getElementById("docs-search");
const statusEl = document.getElementById("status-banner");
const sidebarEl = document.getElementById("docs-sidebar");
const menuToggleEl = document.getElementById("menu-toggle");
const copyLinkEl = document.getElementById("copy-link");

let allDocs = [];
let visibleDocs = [];
let currentPath = "";

init().catch((error) => {
  showStatus(`Failed to initialize docs app: ${String(error)}`);
});

async function init() {
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`Could not load docs manifest (${response.status})`);
  }
  const manifest = await response.json();
  allDocs = manifest.map((path) => normalizeDocPath(path)).filter(Boolean);
  visibleDocs = [...allDocs];
  renderNav();

  const requested = normalizeDocPath(decodeURIComponent(window.location.hash.slice(1))) || "index.md";
  const initial = resolveExistingDoc(requested);
  await openDoc(initial);

  window.addEventListener("hashchange", () => {
    const next = resolveExistingDoc(
      normalizeDocPath(decodeURIComponent(window.location.hash.slice(1))) || "index.md",
    );
    void openDoc(next);
  });

  searchEl.addEventListener("input", () => {
    const query = searchEl.value.trim().toLowerCase();
    visibleDocs = !query
      ? [...allDocs]
      : allDocs.filter((path) => buildDocLabel(path).toLowerCase().includes(query));
    renderNav();
  });

  menuToggleEl.addEventListener("click", () => {
    sidebarEl.classList.toggle("docs-sidebar--open");
  });

  copyLinkEl.addEventListener("click", async () => {
    const url = new URL(window.location.href);
    url.hash = encodeURIComponent(currentPath);
    await navigator.clipboard.writeText(url.toString());
    showStatus("Copied direct link to this document.");
    window.setTimeout(hideStatus, 1800);
  });
}

async function openDoc(path) {
  currentPath = path;
  window.location.hash = encodeURIComponent(path);
  titleEl.textContent = buildDocTitle(path);
  pathPillEl.textContent = `docs/${path}`;
  renderNav();
  sidebarEl.classList.remove("docs-sidebar--open");

  const url = new URL(path, appBaseUrl);
  const response = await fetch(url);
  if (!response.ok) {
    contentEl.innerHTML = "";
    metaEl.innerHTML = "";
    showStatus(`Could not load docs/${path} (${response.status}).`);
    return;
  }

  hideStatus();
  const markdown = await response.text();
  const parsed = splitFrontmatter(markdown);
  const html = renderMarkdown(parsed.body);

  document.title = `${buildDocTitle(path)} | Lala Docs`;
  titleEl.textContent = parsed.title || buildDocTitle(path);
  metaEl.innerHTML = renderMeta(path, parsed.title);
  contentEl.innerHTML = html;
}

function renderNav() {
  const groups = new Map();
  for (const path of visibleDocs) {
    const [first, ...rest] = path.split("/");
    const group = rest.length === 0 ? "root" : first;
    const list = groups.get(group) ?? [];
    list.push(path);
    groups.set(group, list);
  }

  const ordered = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  navEl.innerHTML = ordered
    .map(([group, paths]) => {
      const title = group === "root" ? "General" : prettifySegment(group);
      const links = paths
        .sort((a, b) => a.localeCompare(b))
        .map((path) => {
          const active = path === currentPath ? " nav-link--active" : "";
          return `<a class="nav-link${active}" href="#${encodeURIComponent(path)}">${escapeHtml(buildDocLabel(path))}</a>`;
        })
        .join("");
      return `<section class="nav-section"><h3 class="nav-section__title">${escapeHtml(title)}</h3>${links}</section>`;
    })
    .join("");
}

function renderMeta(path, title) {
  const chips = [
    title ? `Title: ${title}` : null,
    `Path: docs/${path}`,
    `Section: ${prettifySegment(path.split("/")[0] ?? "general")}`,
  ].filter(Boolean);
  return chips.map((chip) => `<span class="docs-meta__chip">${escapeHtml(chip)}</span>`).join("");
}

function splitFrontmatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n")) {
    return { title: null, body: normalized };
  }
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    return { title: null, body: normalized };
  }
  const frontmatter = normalized.slice(4, end);
  const body = normalized.slice(end + 5);
  const titleMatch = frontmatter.match(/^title:\s*"?(.*?)"?$/m);
  return {
    title: titleMatch?.[1]?.trim() || null,
    body,
  };
}

function resolveDocHref(href) {
  if (!href || /^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
    return { kind: "external", path: href };
  }
  const normalized = normalizeDocPath(href);
  const withMd = resolveExistingDoc(normalized);
  if (allDocs.includes(withMd)) {
    return { kind: "doc", path: withMd };
  }
  return { kind: "external", path: href };
}

function resolveExistingDoc(input) {
  const cleaned = normalizeDocPath(input);
  const variants = [cleaned, `${cleaned}.md`, `${cleaned}.mdx`, `${cleaned}/index.md`];
  return variants.find((candidate) => allDocs.includes(candidate)) ?? "index.md";
}

function normalizeDocPath(input) {
  if (!input) {
    return "";
  }
  return input
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\//, "")
    .replace(/^docs\//, "")
    .replace(/#.*$/, "")
    .replace(/\?.*$/, "")
    .trim();
}

function buildDocTitle(path) {
  const label = buildDocLabel(path);
  return label === "Index" ? "Lala Documentation" : label;
}

function buildDocLabel(path) {
  const segments = path.replace(/\.(md|mdx)$/i, "").split("/");
  const last = segments.at(-1) || "index";
  if (last === "index" && segments.length > 1) {
    return prettifySegment(segments.at(-2) || last);
  }
  return prettifySegment(last);
}

function prettifySegment(value) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function showStatus(message) {
  statusEl.hidden = false;
  statusEl.textContent = message;
}

function hideStatus() {
  statusEl.hidden = true;
  statusEl.textContent = "";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarkdown(markdown) {
  const rawHtmlBlocks = [];
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n");
  const markdownWithHtmlPlaceholders = extractRawHtmlBlocks(normalizedMarkdown, rawHtmlBlocks);
  const escaped = escapeHtml(markdownWithHtmlPlaceholders);
  const blocks = [];

  let text = escaped.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const index = blocks.length;
    const label = lang ? `<div class="code-lang">${lang}</div>` : "";
    blocks.push(
      `<pre><code>${code.replace(/^\n+|\n+$/g, "")}</code></pre>`,
    );
    return `__BLOCK_${index}__`;
  });

  text = text
    .split("\n\n")
    .map((chunk) => renderBlock(chunk.trim()))
    .filter(Boolean)
    .join("\n");

  return restoreHtmlBlocks(restoreBlocks(text, blocks), rawHtmlBlocks);
}

function renderBlock(chunk) {
  if (!chunk) {
    return "";
  }
  if (/^#{1,6}\s/m.test(chunk) && !chunk.includes("\n")) {
    const [, hashes, content] = chunk.match(/^(#{1,6})\s+(.*)$/) || [];
    if (hashes && content) {
      const level = hashes.length;
      return `<h${level}>${renderInline(content)}</h${level}>`;
    }
  }
  if (/^>\s?/m.test(chunk)) {
    const lines = chunk
      .split("\n")
      .map((line) => line.replace(/^&gt;\s?/, ""))
      .join(" ");
    return `<blockquote><p>${renderInline(lines)}</p></blockquote>`;
  }
  if (isTableBlock(chunk)) {
    return renderTable(chunk);
  }
  if (isListBlock(chunk)) {
    return renderList(chunk);
  }
  if (/^(-{3,}|\*{3,})$/.test(chunk)) {
    return "<hr>";
  }
  if (/^__BLOCK_\d+__$/.test(chunk)) {
    return chunk;
  }
  return `<p>${renderInline(chunk.replace(/\n/g, "<br>"))}</p>`;
}

function renderList(chunk) {
  const ordered = /^\d+\.\s/.test(chunk);
  const tag = ordered ? "ol" : "ul";
  const items = chunk
    .split("\n")
    .map((line) => line.replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))
    .map((line) => `<li>${renderInline(line)}</li>`)
    .join("");
  return `<${tag}>${items}</${tag}>`;
}

function renderTable(chunk) {
  const lines = chunk.split("\n").filter(Boolean);
  const [headerLine, dividerLine, ...bodyLines] = lines;
  if (!headerLine || !dividerLine) {
    return `<p>${renderInline(chunk)}</p>`;
  }
  const alignments = splitTableCells(dividerLine).map(resolveTableAlignment);
  const headers = splitTableCells(headerLine)
    .map(
      (cell, index) =>
        `<th${renderTableAlignAttr(alignments[index])}>${renderInline(cell)}</th>`,
    )
    .join("");
  const rows = bodyLines
    .map((line) => {
      const cells = splitTableCells(line)
        .map(
          (cell, index) =>
            `<td${renderTableAlignAttr(alignments[index])}>${renderInline(cell)}</td>`,
        )
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function splitTableCells(line) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableBlock(chunk) {
  const lines = chunk.split("\n");
  return (
    lines.length >= 2 &&
    lines[0].includes("|") &&
    /^\|?[\s:-|]+\|?$/.test(lines[1])
  );
}

function isListBlock(chunk) {
  return chunk.split("\n").every((line) => /^([-*]|\d+\.)\s+/.test(line));
}

function renderInline(text) {
  let html = text;
  
  // Handle <Note> components first
  html = html.replace(/<Note>([\s\S]*?)<\/Note>/g, (_match, content) => {
    return `<div class="note-component">${renderInline(content.trim())}</div>`;
  });
  
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, href) => {
    const src = new URL(href, appBaseUrl).toString();
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const resolved = resolveDocHref(href);
    if (resolved.kind === "doc") {
      return `<a href="#${encodeURIComponent(resolved.path)}">${label}</a>`;
    }
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${label}</a>`;
  });
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function restoreBlocks(text, blocks) {
  return text.replace(/__BLOCK_(\d+)__/g, (_match, index) => blocks[Number(index)] ?? "");
}

function extractRawHtmlBlocks(markdown, rawHtmlBlocks) {
  const blockPattern =
    /(^|\n)(<(?:p|div|table)\b[\s\S]*?<\/(?:p|div|table)>|<img\b[\s\S]*?\/?>)(?=\n|$)/gi;
  return markdown.replace(blockPattern, (match, leading, htmlBlock) => {
    const index = rawHtmlBlocks.length;
    rawHtmlBlocks.push(sanitizeTrustedHtml(htmlBlock.trim()));
    return `${leading}\n__HTML_BLOCK_${index}__\n`;
  });
}

function restoreHtmlBlocks(text, rawHtmlBlocks) {
  return text.replace(/<p>__HTML_BLOCK_(\d+)__<\/p>|__HTML_BLOCK_(\d+)__/g, (_match, wrapped, bare) => {
    const index = Number(wrapped ?? bare);
    return rawHtmlBlocks[index] ?? "";
  });
}

function sanitizeTrustedHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const allowedTags = new Set([
    "A",
    "BR",
    "CODE",
    "DIV",
    "EM",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "IMG",
    "P",
    "STRONG",
    "TABLE",
    "THEAD",
    "TBODY",
    "TR",
    "TH",
    "TD",
  ]);
  const allowedAttrs = new Set([
    "alt",
    "align",
    "class",
    "colspan",
    "href",
    "rowspan",
    "src",
    "target",
    "rel",
    "width",
  ]);

  for (const element of template.content.querySelectorAll("*")) {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(document.createTextNode(element.outerHTML));
      continue;
    }
    for (const attr of [...element.attributes]) {
      if (!allowedAttrs.has(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    }
    if (element instanceof HTMLAnchorElement) {
      const href = element.getAttribute("href") ?? "";
      const resolved = resolveDocHref(href);
      if (resolved.kind === "doc") {
        element.setAttribute("href", `#${encodeURIComponent(resolved.path)}`);
        element.removeAttribute("target");
        element.removeAttribute("rel");
      } else {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noreferrer");
      }
    }
    if (element instanceof HTMLImageElement) {
      const src = element.getAttribute("src") ?? "";
      element.setAttribute("src", new URL(src, appBaseUrl).toString());
    }
  }

  return template.innerHTML;
}

function resolveTableAlignment(cell) {
  const trimmed = cell.trim();
  const starts = trimmed.startsWith(":");
  const ends = trimmed.endsWith(":");
  if (starts && ends) {
    return "center";
  }
  if (ends) {
    return "right";
  }
  if (starts) {
    return "left";
  }
  return "";
}

function renderTableAlignAttr(alignment) {
  return alignment ? ` style="text-align:${alignment}"` : "";
}
