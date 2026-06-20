import type { MetadataRoute } from "next";

const SITE_URL = "https://brit-ready.kud.io";

// Index the marketing pages; keep the app shell (personal, client-rendered)
// out of search results.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/", disallow: "/app/" },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
