import { SITE_URL } from '@/lib/config';

interface Review {
  rating: number;
  reviewer: string;
  roleReviewer?: string;
  review: string;
  date: string;
}

interface ReviewSchemaProps {
  reviews: Review[];
}

export function ReviewSchema({ reviews }: ReviewSchemaProps) {
  const siteUrl = SITE_URL;
  
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const reviewCount = reviews.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bauschadensbewertung",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.reviewer
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.review,
      "datePublished": review.date
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}




