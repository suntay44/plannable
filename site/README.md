# Plannable site

First-party product and documentation site for Plannable.

Private production preview: <https://plannable-agent-plans.xtiansun.chatgpt.site>

```bash
npm install
npm run dev
npm run lint
npm test
```

The Vinext build targets the Sites Cloudflare runtime. Crawler routes derive the current request origin so `robots.txt`, `sitemap.xml`, and `llms.txt` remain correct on local, preview, and production hosts.
