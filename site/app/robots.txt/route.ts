import { siteOrigin as origin } from "../_lib/site-origin";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
