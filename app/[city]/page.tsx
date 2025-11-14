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
  const cityData = getCityData(params.city);
  
  if (!cityData) {
    return {
      title: "Stadt nicht gefunden",
      description: "Die angeforderte Stadtseite konnte nicht gefunden werden.",
    };
  }

  const canonicalUrl = cityData.seo.canonical.startsWith('http')
    ? cityData.seo.canonical
    : `${SITE_URL}${cityData.seo.canonical}`;

  return {
    title: cityData.seo.title,
    description: cityData.seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: cityData.seo.openGraph.type as "website",
      title: cityData.seo.openGraph.title,
      description: cityData.seo.openGraph.description,
      images: [
        {
          url: cityData.seo.openGraph.image,
          width: 1200,
          height: 630,
          alt: cityData.seo.openGraph.title,
        },
      ],
      url: cityData.seo.openGraph.url,
    },
    twitter: {
      card: cityData.seo.twitter.card as "summary_large_image",
      title: cityData.seo.twitter.title,
      description: cityData.seo.twitter.description,
      images: [cityData.seo.twitter.image],
    },
    robots: cityData.seo.robots || "index, follow",
  };
}

export default function CityPage({ params }: CityPageProps) {
  const cityData = getCityData(params.city);

  if (!cityData) {
    notFound();
  }

  return <CityPageClient cityData={cityData} />;
}


