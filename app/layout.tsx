import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ozigi | Agentic Social Media Manager",
  description:
    "An Agentic Content Engine for social media handlers, technical writers and developer educators.",
  openGraph: {
    title: "Ozigi | The Agentic Content Engine",
    description: "Docs as code? Meet content as code. Build multi-platform social campaigns directly from your raw notes, PDFs, and links.",
    siteName: "Ozigi",
    images: [
      {
        url: "/heropage.png", 
        width: 1200,
        height: 630,
        alt: "Ozigi Context Engine Interface",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Ozigi | The Agentic Content Engine",
    description: "Docs as code? Meet content as code. Build multi-platform social campaigns directly from your raw notes, PDFs, and links.",
    images: ["/heropage.png"], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
