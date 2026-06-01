import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Code-Site.Art",
    short_name: "Code-Site",
    description:
      "Custom-coded websites for business. Live in 4–10 weeks. Boutique studio in Kyiv.",
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#121212",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
      { src: "/logo-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
