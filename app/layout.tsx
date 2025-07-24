// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "../providers/ConvexClientProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import IsFetchingProvider from "@/providers/IsFetchingProvider";
import { ErrorBoundary } from "react-error-boundary";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoForge - AI-Powered Podcast Creation",
  description: "Create professional podcasts with AI voices and automated content generation",
  icons: {
    icon: '/icons/miclogo.svg'
  },
  authors: [
    { name: "EchoForge Team" }
  ],
  keywords: ["podcast", "ai", "artificial intelligence", "audio", "content creation", "text-to-speech"],
  openGraph: {
    title: "EchoForge - AI-Powered Podcast Creation",
    description: "Create professional podcasts with AI voices and automated content generation",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <ErrorBoundary 
          fallback={
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
              <p className="mb-6">We're experiencing a technical issue. Please try refreshing the page or come back later.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[--accent-color] text-white rounded-md hover:bg-[--accent-color]/90 transition"
              >
                Refresh Page
              </button>
            </div>
          }
        >
          <IsFetchingProvider>
            <AudioProvider>
              <body className={`${inter.className}`}>
                  {children}
                  <SonnerToaster position="bottom-right" />
                  <Toaster />
                  <Analytics />        
              </body>
              {/* <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script> */}
            </AudioProvider>
          </IsFetchingProvider>
        </ErrorBoundary>
    </html>
  );
}
