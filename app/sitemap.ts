import type { MetadataRoute } from "next";
import { LEARNING_THEMES } from "@/data/learning-themes";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes = ["", "/about", "/learn", "/assessment", "/assessment/results", "/flow", "/plan", "/journal", "/circle", "/dashboard", "/privacy", "/accessibility", "/responsible-use"];
  const now = new Date();
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r || "/"}`, lastModified: now, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 })),
    ...LEARNING_THEMES.map((t) => ({ url: `${base}/learn/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
