import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
}

export default function SEO({
  title = "Swissperiences | Your Private Sanctuary in the Alps",
  description = "A boutique home base in Villars-sur-Ollon curated by Caueh Vidal. Private alpine retreats and curated road journeys.",
  keywords = "swiss experiences, switzerland travel, alpine retreats, luxury switzerland, swiss alps, boutique host switzerland, authentic switzerland",
  canonical = "https://www.swissperiences.ch",
  ogType = "website",
  ogImage = "https://www.swissperiences.ch/og-image.jpg",
  structuredData,
}: SEOProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const ogLocale = currentLang === "pt" ? "pt_PT" : "en_US";

  return (
    <Helmet
      htmlAttributes={{ lang: currentLang }}
    >
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={canonical} />

      {/* Multilingual SEO (Bidirectional & Self-referencing) */}
      <link rel="alternate" hrefLang="en" href="https://www.swissperiences.ch/en" />
      <link rel="alternate" hrefLang="pt" href="https://www.swissperiences.ch/pt" />
      <link rel="alternate" hrefLang="x-default" href="https://www.swissperiences.ch/en" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Swissperiences" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@Swissperiences" />
      <meta name="twitter:creator" content="@Swissperiences" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content={currentLang === "pt" ? "Portuguese" : "English"} />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Swissperiences" />

      {/* Geo Tags */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
