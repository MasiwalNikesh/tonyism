import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNavigation from "@/components/layout/MobileNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tonyism - Testimonies of Love & Legacy",
    template: "%s | Tonyism"
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  description:
    "Discover heartfelt testimonies from family, friends, and colleagues about Tony Batra (1959-2023). Search through memories, stories, and wisdom that celebrate his life and the Tony-ism philosophy of living with joy, generosity, and love.",
  keywords: [
    "Tony Batra",
    "testimonies",
    "memorial",
    "wisdom",
    "legacy",
    "philosophy", 
    "family stories",
    "friendship",
    "tony-ism",
    "memories",
    "love",
    "hanuman devotee"
  ],
  authors: [{ name: "Tony Batra Family" }],
  creator: "Tony Batra Family",
  publisher: "Tony Batra Family",
  category: "Memorial",
  openGraph: {
    title: "Tonyism - Testimonies of Love & Legacy",
    description:
      "Discover heartfelt testimonies from family, friends, and colleagues about Tony Batra. Search through memories and stories that celebrate his life and philosophy.",
    type: "website",
    locale: "en_US",
    url: "https://tonyism.com",
    siteName: "Tonyism",
    images: [
      {
        url: "/images/tony-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tony Batra - Tonyism Memorial"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonyism - Testimonies of Love & Legacy", 
    description:
      "Discover heartfelt testimonies about Tony Batra's life and legacy.",
    creator: "@tonyism",
    images: ["/images/tony-twitter-card.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://tonyism.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Serif+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        }}
      >
        <MobileNavigation />
        {children}
      </body>
    </html>
  );
}
