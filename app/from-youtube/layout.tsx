import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content That Doesn't Sound Like AI — Try Ozigi",
  description:
    "You just watched how it works. Now try it yourself — paste your notes and see content that sounds like you, not like a chatbot.",
  robots: { index: false, follow: false },
};

export default function FromYouTubeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
