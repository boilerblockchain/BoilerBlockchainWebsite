import type { Metadata, Viewport } from "next";
import { Inter, Tomorrow } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

// Same pairing as the main site: Tomorrow for display, Inter for body.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const tomorrow = Tomorrow({
  variable: "--font-tomorrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Attendance · Boiler Blockchain",
  description: "Wallet-verified attendance for Boiler Blockchain.",
};

// Almost every check-in happens on a phone, so pin the viewport and tint the
// mobile browser chrome to match the page instead of flashing white.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${tomorrow.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-950 text-white">
        <Providers>
          {/* Mirrors the main site's nav: 80px bar, hairline base, uppercase
              display type, flat on black. */}
          <header className="sticky top-0 z-50 border-b border-neutral-700/60 bg-neutral-950/95 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:h-20">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/bb-logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  priority
                />
                {/* The full wordmark doesn't fit next to the nav on a phone. */}
                <span className="eyebrow hidden text-sm font-semibold sm:inline">
                  Boiler Blockchain
                </span>
                <span className="eyebrow text-xs text-accent">Attendance</span>
              </Link>
              <div className="eyebrow flex items-center gap-4 text-[11px] text-neutral-400 sm:gap-6 sm:text-xs">
                <Link href="/officer" className="hover:text-white">
                  Officers
                </Link>
                <Link href="/profile" className="hover:text-white">
                  My attendance
                </Link>
                {/* Back out to the main site; this app has its own origin. */}
                <a
                  href="https://www.boilerblockchain.org"
                  className="hidden hover:text-white sm:inline"
                >
                  Main site
                </a>
              </div>
            </nav>
          </header>

          <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:py-12">
            {children}
          </main>

          <footer className="eyebrow border-t border-neutral-700/60 px-4 py-6 text-center text-[11px] text-neutral-500">
            Wallet-verified attendance · Boiler Blockchain
          </footer>
        </Providers>
      </body>
    </html>
  );
}
