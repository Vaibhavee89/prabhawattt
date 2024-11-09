import Navbar from "@/components/navbar";
import { AuthContextProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prabhawatt.vercel.app"),
  title: "PrabhaWatt - Smart Solar Solutions",
  description:
    "Discover PrabhaWatt, where innovative solar technology meets smart savings. Join us in transforming your energy consumption into sustainable savings.",
  openGraph: {
    title: "PrabhaWatt - Smart Solar Solutions",
    description:
      "Illuminate Your Savings with PrabhaWatt: Where Solar Meets Smart.",
    images: ["/preview.png"],
    url: "https://prabhawatt.vercel.app",
    type: "website",
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
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider>
          <NextTopLoader showSpinner={false} color="#65a30d" />
          <Navbar />
          {children}
          <Toaster />
        </AuthContextProvider>
      </body>
    </html>
  );
}
