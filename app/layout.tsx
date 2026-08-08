import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";
const socialImage = `${siteOrigin}${basePath}/og.png`;

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteOrigin}${basePath || "/"}`),
  title: { default: "LocomotiveTrader.com | Locomotive Parts Marketplace", template: "%s | LocomotiveTrader.com" },
  description: "Search verified locomotive parts and contact trusted rail industry vendors directly. No buyer fees and no commission.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "LocomotiveTrader.com",
    description: "Find the part. Keep the fleet moving.",
    type: "website",
    url: `${siteOrigin}${basePath || "/"}`,
    images: [{ url: socialImage, width: 1200, height: 630, alt: "LocomotiveTrader.com — Find the part. Keep the fleet moving." }],
  },
  twitter: { card: "summary_large_image", title: "LocomotiveTrader.com", description: "Find the part. Keep the fleet moving.", images: [socialImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
