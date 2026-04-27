import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ozigi Pricing — Free to Start, Scale When You Ship",
  description:
    "5 campaigns free every month. No credit card required. Starter at $9/month for unlimited campaigns. Team at $29/month adds image generation, newsletter sends, and Slack. Always in your voice.",
  keywords: [
    "Ozigi pricing",
    "AI content generator pricing",
    "free AI writing tool",
    "social media post generator price",
    "affordable AI content tool",
  ],
  openGraph: {
    title: "Ozigi Pricing — Free to Start, Scale When You Ship",
    description:
      "Start free. 5 campaigns per month, no credit card. Upgrade when you need more — Starter at $9, Team at $29.",
    url: "https://ozigi.app/pricing",
    siteName: "Ozigi",
    type: "website",
    images: [
      {
        url: "https://ozigi.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ozigi Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozigi Pricing — Free to Start, Scale When You Ship",
    description: "5 campaigns free every month. No credit card. Upgrade when you're ready.",
    images: ["https://ozigi.app/opengraph-image.png"],
  },
  alternates: { canonical: "https://ozigi.app/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
