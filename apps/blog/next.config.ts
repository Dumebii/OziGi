import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // If you want to reuse the same image domains as main app, add them:
  images: {
    domains: ["ozigi.app", "blog.ozigi.app"],
  },
};

const withMDX = createMDX({});
export default withMDX(nextConfig);