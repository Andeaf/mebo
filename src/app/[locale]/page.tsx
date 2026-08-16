import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import ProcessCards from "@/components/ProcessCards";
import Showcase from "@/components/Showcase";
import FeatureBlocks from "@/components/FeatureBlocks";
import MaterialColors from "@/components/MaterialColors";
import StatementMoment from "@/components/StatementMoment";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { company } from "@/lib/company";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${company.siteUrl}/#business`,
    name: company.legalName,
    description: t("description"),
    url: company.siteUrl,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: company.address.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "11:00",
        closes: "16:30",
      },
    ],
    sameAs: [company.instagramUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <BrandStatement />
        <ProcessCards />
        <Showcase />
        <FeatureBlocks />
        <MaterialColors />
        <StatementMoment />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
