import type { MetadataRoute } from "next";

const SITE_URL = "https://brit-ready.vercel.app";

const sitemap = (): MetadataRoute.Sitemap => [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  {
    url: `${SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

export default sitemap;
