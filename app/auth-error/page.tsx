import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error — Ozigi",
  robots: { index: false, follow: false },
};

export default function AuthError() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Authentication Failed</h1>
      <p className="mt-4">Please try again or contact support.</p>
      <a href="/" className="mt-6 inline-block bg-slate-900 text-white px-6 py-3 rounded-xl">
        Go Home
      </a>
    </div>
  )
}