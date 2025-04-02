"use client"

import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"

export function FullscreenButton() {
  return (
    <Button 
      variant="secondary" 
      size="icon" 
      className=""
      onClick={() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
          } else if ((iframe as any).webkitRequestFullscreen) {
            (iframe as any).webkitRequestFullscreen();
          } else if ((iframe as any).msRequestFullscreen) {
            (iframe as any).msRequestFullscreen();
          }
        }
      }}
    >
      <Maximize2 className="w-5 h-5" />
    </Button>
  )
} 