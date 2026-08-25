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
    {
      url: `${company.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/about`,
          en: `${company.siteUrl}/en/about`,
        },
      },
    },
    {
      url: `${company.siteUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/about`,
          en: `${company.siteUrl}/en/about`,
        },
      },
    },
    {
      url: `${company.siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/privacy`,
          en: `${company.siteUrl}/en/privacy`,
        },
      },
    },
    {
      url: `${company.siteUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/privacy`,
          en: `${company.siteUrl}/en/privacy`,
        },
      },
    },
    {
      url: `${company.siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/cookies`,
          en: `${company.siteUrl}/en/cookies`,
        },
      },
    },
    {
      url: `${company.siteUrl}/en/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: {
        languages: {
          nl: `${company.siteUrl}/cookies`,
          en: `${company.siteUrl}/en/cookies`,
        },
      },
    },
  ];
}
