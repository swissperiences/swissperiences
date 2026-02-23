import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical = "https://www.swissperiences.ch",
  ogType = "website",
  ogImage = "https://www.swissperiences.ch/og-image.jpg",
  structuredData,
  noIndex = false,
}: SEOProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const ogLocale = currentLang === "pt" ? "pt_PT" : "en_US";

  // Use translated defaults if props are not provided
  const finalTitle = title || t("seo.defaultTitle", "Swissperiences | Your Private Sanctuary in the Alps");
  const finalDescription = description || t("seo.defaultDescription", "A boutique alpine sanctuary in Villars-sur-Ollon. Curated Swiss experiences for those who seek silence.");
  const finalKeywords = keywords || t("seo.keywords", "swiss experiences, switzerland travel, alpine retreats");

  // Build page-aware hreflang links from canonical
  const canonicalPath = canonical
    .replace("https://www.swissperiences.ch", "")
    .replace(/^\/(en|pt)/, "") || "/";

  return (
    <Helmet
      htmlAttributes={{ lang: currentLang }}
    >
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={canonical} />

      {/* Multilingual SEO (Bidirectional & Self-referencing, page-aware) */}
      <link rel="alternate" hrefLang="en" href={`https://www.swissperiences.ch/en${canonicalPath === "/" ? "" : canonicalPath}`} />
      <link rel="alternate" hrefLang="pt" href={`https://www.swissperiences.ch/pt${canonicalPath === "/" ? "" : canonicalPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://www.swissperiences.ch/en${canonicalPath === "/" ? "" : canonicalPath}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Swissperiences" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@Swissperiences" />
      <meta name="twitter:creator" content="@Swissperiences" />

      {/* Additional SEO */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content={currentLang === "pt" ? "Portuguese" : "English"} />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Swissperiences" />

      {/* Geo Tags */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />

      {/* Structured Data */}
      {structuredData && (
        Array.isArray(structuredData)
          ? structuredData.map((data, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(data)}
              </script>
            ))
          : (
            <script type="application/ld+json">
              {JSON.stringify(structuredData)}
            </script>
          )
      )}
    </Helmet>
  );
}
