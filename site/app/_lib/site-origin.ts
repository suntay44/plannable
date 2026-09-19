export const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://plannable-agent-plans.xtiansun.chatgpt.site"
).origin;
