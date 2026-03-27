import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chess Dashboard",
    short_name: "Chess",
    description: "Šachové štatistiky z Chess.com a Lichess — grafy, otvárania, rating história.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1117",
    theme_color: "#0f1117",
    categories: ["games", "sports"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
