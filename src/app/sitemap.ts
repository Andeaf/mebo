import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${company.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/`,
          en: `${company.siteUrl}/en`,
        },
      },
    },
    {
      url: `${company.siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/`,
          en: `${company.siteUrl}/en`,
        },
      },
    },
  ];
}
