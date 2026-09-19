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
  ["/faq", "Frequently asked questions", "Answers before you hand over the keyboard"],
  ["/docs/security-planning", "Security planning for AI-built software", "Plan the protection before writing the feature"],
  ["/examples/private-customer-app", "Example: plan a private customer app", "Keep one customer’s records away from another"]
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

test("crawler resources match page canonicals and include every documented route", async () => {
  const home = await (await request("/")).text();
  const canonical = home.match(/<link rel="canonical" href="([^"]+)"/)[1];
  const origin = new URL(canonical).origin;
  const [robots, sitemap, llms] = await Promise.all([
    request("/robots.txt"), request("/sitemap.xml"), request("/llms.txt")
  ]);
  for (const response of [robots, sitemap, llms]) assert.equal(response.status, 200);
  assert.ok((await robots.text()).includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemapBody = await sitemap.text();
  const llmsBody = await llms.text();
  for (const [path] of pages) {
    assert.ok(sitemapBody.includes(`<loc>${origin}${path}</loc>`));
    if (path !== "/") assert.ok(llmsBody.includes(`${origin}${path}`));
  }
});

test("security content separates unreleased guidance from application proof", async () => {
  const guidance = await (await request("/docs/security-planning")).text();
  const example = await (await request("/examples/private-customer-app")).text();
  assert.match(guidance, /unreleased guidance/);
  assert.match(guidance, /pilot remain pending/);
  assert.match(guidance, /does not execute application security tests/);
  assert.match(example, /access.owner@1/);
  assert.match(example, /deliberately disabled control/);
  assert.match(example, /not a generated customer app/);
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
