import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Brit Ready — Life in the UK",
  short_name: "Brit Ready",
  description:
    "A non-official, gamified way to prepare for the Life in the UK Test. Learn every fact, practise the format, and know when you are ready.",
  start_url: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#0a1228",
  theme_color: "#0a1228",
  categories: ["education", "productivity"],
  icons: [
    {
      src: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
});

export default manifest;
