import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Game Platform",
  description: "Learn more about Game Platform, our mission, and what makes us the best destination for online gaming.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="container pt-8 pb-16">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">ABOUT US</span>
                <h1 className="text-3xl font-bold">Our Story</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Building the future of online gaming entertainment
              </p>
            </div>
            <div className="prose prose-gray dark:prose-invert">
              <p>
                Game Platform was founded with a simple mission: to make high-quality gaming accessible to everyone, 
                anywhere, at any time. We believe that great games should be easy to discover, free to play, 
                and available instantly in your browser.
              </p>
              <p>
                Today, we're proud to host over 1000+ carefully curated games across multiple genres, 
                serving millions of players worldwide. Our platform continues to grow and evolve, 
                driven by our passion for gaming and commitment to our community.
              </p>
            </div>
          </div>
          <div className="flex-1 relative aspect-video w-full max-w-xl rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            <Image
              src="/about-hero.jpg"
              alt="Game Platform Team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16 border-y bg-muted/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-primary">1000+</h3>
            <p className="text-sm text-muted-foreground">Games Available</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-primary">10M+</h3>
            <p className="text-sm text-muted-foreground">Monthly Players</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-primary">50+</h3>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-bold text-primary">24/7</h3>
            <p className="text-sm text-muted-foreground">Support Available</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container py-16">
        <div className="space-y-2 text-center mb-12">
          <h2 className="text-3xl font-bold">Our Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we do</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg w-fit">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Safety First</h3>
            <p className="text-muted-foreground">
              We prioritize creating a safe and secure environment for all our users, 
              with strict content moderation and family-friendly games.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg w-fit">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Community Driven</h3>
            <p className="text-muted-foreground">
              Our platform thrives on community feedback and interaction. 
              We actively listen to our players and evolve based on their needs.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg w-fit">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously push the boundaries of browser-based gaming, 
              bringing new technologies and experiences to our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container py-16 border-t">
        <div className="space-y-2 text-center mb-12">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground">The passionate people behind Game Platform</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Alex Johnson", role: "Founder & CEO", image: "/team/alex.jpg" },
            { name: "Sarah Chen", role: "Head of Content", image: "/team/sarah.jpg" },
            { name: "Mike Brown", role: "Lead Developer", image: "/team/mike.jpg" },
            { name: "Lisa Wong", role: "Community Manager", image: "/team/lisa.jpg" },
          ].map((member) => (
            <div key={member.name} className="text-center space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 border-t">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Start Playing?</h2>
          <p className="text-muted-foreground">
            Join millions of players and discover your next favorite game on Game Platform.
            No downloads required, just click and play!
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/games" className="gap-2">
                Browse Games
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/contact" className="gap-2">
                Contact Us
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 