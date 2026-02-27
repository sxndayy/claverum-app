import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityData, getAllCitySlugs } from "@/lib/cityData";
import CityPageClient from "@/components/pages/CityPageClient";
import { SITE_URL } from "@/lib/config";

interface CityPageProps {
  params: {
    city: string;
  };
}

// Generate static params for all cities at build time
export async function generateStaticParams() {
  const slugs = getAllCitySlugs();
  return slugs.map((slug) => ({
    city: slug,
  }));
}

// Generate metadata for each city page
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  try {
  const cityData = getCityData(params.city);
  
  if (!cityData) {
    return {
      title: "Stadt nicht gefunden",
      description: "Die angeforderte Stadtseite konnte nicht gefunden werden.",
    };
  }

    // Defensive checks for SEO data
    if (!cityData.seo) {
      return {
        title: cityData.city ? `${cityData.city} Bauschadensanalyse` : "Bauschadensanalyse",
        description: "Unabhängige Bauschadensanalyse für Hauskauf.",
      };
    }

    // Normalize canonical URL - ensure trailing slash to match trailingSlash: true
    let canonicalPath = cityData.seo.canonical || `/${params.city}`;
    if (!canonicalPath.endsWith('/')) {
      canonicalPath = `${canonicalPath}/`;
    }
    
    const canonicalUrl = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${SITE_URL}${canonicalPath}`;

    // Safe access to openGraph with fallbacks
    const openGraph = cityData.seo.openGraph || {};
    const ogImage = openGraph.image || `${SITE_URL}/og/hero-altbau.jpg`;
    const ogTitle = openGraph.title || cityData.seo.title || `${cityData.city} Bauschadensanalyse`;
    const ogDescription = openGraph.description || cityData.seo.metaDescription || "";
    const ogUrl = openGraph.url || canonicalUrl;

    // Safe access to twitter with fallbacks
    const twitter = cityData.seo.twitter || {};
    const twitterImage = twitter.image || ogImage;
    const twitterTitle = twitter.title || ogTitle;
    const twitterDescription = twitter.description || ogDescription;

  return {
      title: cityData.seo.title || `${cityData.city} Bauschadensanalyse`,
      description: cityData.seo.metaDescription || "Unabhängige Bauschadensanalyse für Hauskauf.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
        type: (openGraph.type as "website") || "website",
        title: ogTitle,
        description: ogDescription,
      images: [
        {
            url: ogImage,
          width: 1200,
          height: 630,
            alt: ogTitle,
        },
      ],
        url: ogUrl,
    },
    twitter: {
        card: (twitter.card as "summary_large_image") || "summary_large_image",
        title: twitterTitle,
        description: twitterDescription,
        images: [twitterImage],
    },
    robots: cityData.seo.robots || "index, follow",
  };
  } catch (error) {
    console.error(`Error generating metadata for city: ${params.city}`, error);
    // Return safe fallback metadata
    return {
      title: "Bauschadensanalyse",
      description: "Unabhängige Bauschadensanalyse für Hauskauf.",
    };
  }
}

export default function CityPage({ params }: CityPageProps) {
  const cityData = getCityData(params.city);

  if (!cityData) {
    notFound();
  }

  return <CityPageClient cityData={cityData} />;
}




