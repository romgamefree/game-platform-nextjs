"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Share, Facebook, Twitter, Linkedin, Link, Instagram, MessageCircle, Bookmark, MessageSquare, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface ShareButtonProps {
  title: string
  url: string
  image: string
  description?: string
}

export function ShareButton({ title, url, image, description }: ShareButtonProps) {
  const { toast } = useToast()

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&picture=${encodeURIComponent(image)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}`,
      color: "text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&images=${encodeURIComponent(image)}`,
      color: "text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: `https://instagram.com/share?url=${encodeURIComponent(url)}&caption=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}`,
      color: "text-[#E4405F] hover:bg-[#E4405F]/10",
    },
    {
      name: "Pinterest",
      icon: Bookmark,
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(image)}`,
      color: "text-[#BD081C] hover:bg-[#BD081C]/10",
    },
    {
      name: "Reddit",
      icon: MessageSquare,
      href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}`,
      color: "text-[#FF4500] hover:bg-[#FF4500]/10",
    },
    {
      name: "Tumblr",
      icon: MessageCircle,
      href: `https://www.tumblr.com/share/link?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}`,
      color: "text-[#35465C] hover:bg-[#35465C]/10",
    },
    {
      name: "WhatsApp",
      icon: Share2,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}&image=${encodeURIComponent(image)}`,
      color: "text-[#25D366] hover:bg-[#25D366]/10",
    },
    {
      name: "Copy Link",
      icon: Link,
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied!",
            description: "The game link has been copied to your clipboard.",
            duration: 2000,
          })
        } catch (err) {
          console.error("Failed to copy link:", err)
          toast({
            title: "Error",
            description: "Failed to copy link to clipboard.",
            variant: "destructive",
            duration: 2000,
          })
        }
      },
      color: "text-primary hover:bg-primary/10",
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hover:bg-primary/5 transition-colors"
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Share this game</h4>
            <span className="text-xs text-muted-foreground/60">Click to share</span>
          </div>
          
          {/* Preview Card */}
          <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted/50">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h5 className="text-sm font-medium text-white line-clamp-2">{title}</h5>
              {description && (
                <p className="text-xs text-white/80 line-clamp-1 mt-1">{description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200 hover:scale-[1.02]",
                  option.color
                )}
                onClick={option.onClick}
                asChild={!option.onClick}
              >
                {option.onClick ? (
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </div>
                ) : (
                  <a
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </a>
                )}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 