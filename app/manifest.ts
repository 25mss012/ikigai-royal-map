import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ikigai — The Royal Map of Purpose",
    short_name: "Ikigai",
    description: "A private, practical journey to understand what gives you energy, meaning, connection, and momentum.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF9EE",
    theme_color: "#171A2B",
    lang: "en",
    categories: ["education", "lifestyle", "health"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
  };
}
