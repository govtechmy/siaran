import { Metadata } from "next";

export function getPageMetadata(options: {
  title: string;
  description: string;
  url?: string;
  imageUrl: string;
  siteName: string;
}): Metadata {
  return {
    title: options.title,
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      siteName: options.siteName,
      url: options.url || process.env.APP_URL,
      type: "website",
    },
    other: {
      "og:image": options.imageUrl,
      "og:image:width": 1200,
      "og:image:height": 630,
      "twitter:image": options.imageUrl,
      "twitter:image:width": 1200,
      "twitter:image:height": 630,
    },
  };
}
