import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentry Test — Ozigi",
  robots: { index: false, follow: false },
};

export default function SentryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
