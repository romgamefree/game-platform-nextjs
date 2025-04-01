import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6" />
              <span className="font-bold">GameHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">The best place to play free online games.</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Games</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-foreground">
                  All Games
                </Link>
              </li>
              <li>
                <Link href="/games?category=1" className="text-muted-foreground hover:text-foreground">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/games?category=2" className="text-muted-foreground hover:text-foreground">
                  Puzzle
                </Link>
              </li>
              <li>
                <Link href="/games?category=3" className="text-muted-foreground hover:text-foreground">
                  Strategy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GameHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

