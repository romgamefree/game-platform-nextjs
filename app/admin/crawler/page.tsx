import type { Metadata } from "next"
import { CrawlerClient } from "@/components/admin/crawler-client"

export const metadata: Metadata = {
  title: "Game Crawler",
  description: "Crawl and manage games from various sources",
}

export default function CrawlerPage() {
  return <CrawlerClient />
} 