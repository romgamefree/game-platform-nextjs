import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Game Platform",
  description: "Get in touch with Game Platform team. We're here to help with any questions or concerns.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="container pt-8 pb-16">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">CONTACT US</span>
                <h1 className="text-3xl font-bold">Get in Touch</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                We're here to help and answer any questions you might have
              </p>
            </div>
            <div className="prose prose-gray dark:prose-invert">
              <p>
                Whether you have a question about our games, need technical support, 
                or want to provide feedback, our team is ready to assist you. 
                We look forward to hearing from you!
              </p>
            </div>
          </div>
          <div className="flex-1 relative aspect-video w-full max-w-xl rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            <Image
              src="/contact-hero.jpg"
              alt="Contact Us"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="container py-16 border-y bg-muted/50">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email Us</h3>
              <p className="text-sm text-muted-foreground">support@gameplatform.com</p>
              <p className="text-sm text-muted-foreground">partners@gameplatform.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Call Us</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Visit Us</h3>
              <p className="text-sm text-muted-foreground">123 Gaming Street</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA 94107</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Send us a Message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-16 border-t">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "How do I report a bug or technical issue?",
                answer: "You can report bugs directly through our contact form or email support@gameplatform.com. Please include details about the issue and steps to reproduce it."
              },
              {
                question: "How can I suggest a new game?",
                answer: "We welcome game suggestions! Use our contact form and select 'Game Suggestion' as the subject. Include the game name and why you think it would be a good fit."
              },
              {
                question: "What's your response time for support requests?",
                answer: "We aim to respond to all support requests within 24 hours during business days. For urgent issues, please call our support line."
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/faq" className="gap-2">
                View All FAQs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 