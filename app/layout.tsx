import { Inter } from "next/font/google"
import { Metadata, Viewport } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSettings } from "@/lib/settings"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSettings()
  return {
    themeColor: (settings.data["site.themeColor"] as string) || "#000000",
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  const siteName = (settings.data["site.name"] as string) || "GameHub"
  const siteUrl = (settings.data["site.url"] as string) || "https://gamehub.example.com"
  const siteDescription = (settings.data["site.description"] as string) || "Discover and play the best online games"
  const defaultTitle = (settings.data["seo.defaultTitle"] as string) || siteName
  const titleTemplate = (settings.data["seo.titleTemplate"] as string) || `%s | ${siteName}`

  return {
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: siteDescription,
    keywords: (settings.data["site.keywords"] as string)?.split(",").map((k: string) => k.trim()) || [
      "games",
      "online games",
      "browser games",
      "free games",
    ],
    icons: (settings.data["site.favicon"] as string) ? [{ url: settings.data["site.favicon"] as string }] : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: defaultTitle,
      description: siteDescription,
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: siteDescription,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}

import './globals.css'
