"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GamePixCrawler } from "@/components/admin/gamepix-crawler"
import { GameMonetizeCrawler } from "@/components/admin/gamemonetize-crawler"

export function CrawlerClient() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Game Crawler</h1>
      <Tabs defaultValue="gamepix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gamepix">GamePix</TabsTrigger>
          <TabsTrigger value="gamemonetize">GameMonetize</TabsTrigger>
        </TabsList>
        <TabsContent value="gamepix">
          <GamePixCrawler />
        </TabsContent>
        <TabsContent value="gamemonetize">
          <GameMonetizeCrawler />
        </TabsContent>
      </Tabs>
    </div>
  )
} 