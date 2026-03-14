"use client";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-16 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1 flex flex-col items-start md:items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg mb-3">
              O
            </div>
            <h3 className="text-white font-bold text-lg">Ozigi</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Enterprise AI platform for building, deploying, and scaling intelligent applications.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col items-start">
            <h4 className="text-foreground font-semibold text-sm mb-4">Product</h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/architecture"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Architecture
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col items-start">
            <h4 className="text-foreground font-semibold text-sm mb-4">Resources</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/dumebii"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://dev.to/dumebii"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Blog
              </a>
              <a
                href="https://linkedin.com/in/dumebi-okolo"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start">
            <h4 className="text-foreground font-semibold text-sm mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:okolodumebi@gmail.com"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Email
              </a>
              <button className="text-muted-foreground hover:text-primary text-sm transition-colors text-left">
                Support
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground text-xs">
            © 2026 Ozigi. All rights reserved. Built for content wizzes.
          </p>
        </div>
      </div>
    </footer>
  );
}
