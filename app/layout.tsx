import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Café Guide",
  title: {
    default: "Café Guide",
    template: "%s — Café Guide",
  },
  description: "Recettes de café optimisées pour votre machine.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Café Guide",
    startupImage: [
      // iPhone 14 Pro Max
      {
        url: "/icons/icon-512.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      // iPhone SE / generic fallback
      {
        url: "/icons/icon-192.png",
        media: "(device-width: 375px) and (device-height: 667px)",
      },
    ],
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Café Guide",
    title: "Café Guide",
    description: "Recettes de café optimisées pour votre machine.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c4773a" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0f0a" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* iOS install icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
