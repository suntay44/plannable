import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const siteRoot = new URL("../", import.meta.url);

async function request(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} }
  );
}

const pages = [
  ["/", "Evidence-gated plans for AI coding agents", "Implementation plans that AI agents can actually finish"],
  ["/docs/getting-started", "Getting started", "Create your first executable plan"],
  ["/docs/commands", "CLI command reference", "The Plannable CLI, command by command"],
  ["/concepts/plannableplan", "What is PlannablePlan?", "PlannablePlan is a compact execution brief"],
  ["/compare/spec-kit", "Plannable vs spec-kit", "Plannable or spec-kit?"],
  ["/faq", "Frequently asked questions", "Answers before you hand over the keyboard"]
];

for (const [path, title, heading] of pages) {
  test(`server-renders ${path} with unique metadata and answer-first content`, async () => {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| Plannable</title>`));
    assert.match(html, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /href="\/docs\/getting-started"/);
    assert.doesNotMatch(html, /codex-preview|Starter Project|Your site is taking shape/i);
  });
}

test("crawler and answer-engine resources use the request origin", async () => {
  const [robots, sitemap, llms] = await Promise.all([
    request("/robots.txt"),
    request("/sitemap.xml"),
    request("/llms.txt")
  ]);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: http:\/\/localhost\/sitemap\.xml/);
  assert.equal(sitemap.status, 200);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /<loc>http:\/\/localhost\/docs\/getting-started<\/loc>/);
  assert.match(sitemapBody, /<loc>http:\/\/localhost\/faq<\/loc>/);
  assert.equal(llms.status, 200);
  assert.match(await llms.text(), /Evidence-gated implementation planning/);
});

test("ships bespoke metadata assets and no starter preview", async () => {
  await Promise.all([
    access(new URL("public/og-plannable.png", siteRoot)),
    access(new URL("public/favicon.svg", siteRoot))
  ]);
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", siteRoot)));

  const [layout, packageJson] = await Promise.all([
    readFile(new URL("app/layout.tsx", siteRoot), "utf8"),
    readFile(new URL("package.json", siteRoot), "utf8")
  ]);
  assert.match(layout, /og-plannable\.png/);
  assert.match(layout, /SoftwareSourceCode/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|site-creator-vinext-starter/);
});
