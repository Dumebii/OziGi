import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ozigi Architecture — AI Constraint Engine Design Decisions",
  description:
    "Open architecture decision records explaining how Ozigi processes context, enforces the Banned Lexicon, and generates authentic social content without AI-speak.",
  openGraph: {
    title: "Ozigi Architecture — AI Constraint Engine Design Decisions",
    description: "How the Ozigi constraint engine works. Open ADRs covering the Banned Lexicon, context processing, and voice enforcement.",
    url: "https://ozigi.app/architecture",
    siteName: "Ozigi",
    type: "website",
    images: [{ url: "https://ozigi.app/opengraph-image.png", width: 1200, height: 630, alt: "Ozigi Architecture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozigi Architecture — AI Constraint Engine Design Decisions",
    description: "Open ADRs covering the Banned Lexicon, context processing, and how Ozigi enforces your voice.",
    images: ["https://ozigi.app/opengraph-image.png"],
  },
  alternates: { canonical: "https://ozigi.app/architecture" },
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}