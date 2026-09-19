import { siteOrigin as origin } from "../_lib/site-origin";

const routes = [
  "/",
  "/docs/getting-started",
  "/docs/commands",
  "/concepts/plannableplan",
  "/compare/spec-kit",
  "/faq",
  "/docs/security-planning",
  "/examples/private-customer-app"
];

export function GET() {
  const urls = routes.map((route) => `<url><loc>${origin}${route}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8" }
  });
}
