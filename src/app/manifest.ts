import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "بصرفه",
    short_name: "بصرفه",
    description: "مقایسه سریع قیمت محصولات بر اساس وزن یا حجم",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAF7",
    theme_color: "#0F766E",
    dir: "rtl",
    lang: "fa",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
