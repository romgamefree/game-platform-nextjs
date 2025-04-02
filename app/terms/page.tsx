import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - Game Platform",
  description: "Read our Terms of Service to understand the rules and guidelines for using Game Platform.",
}

export default function TermsPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              Welcome to Game Platform. By accessing or using our website and services, you agree to be bound by these Terms of Service.
              Please read these terms carefully before using our platform.
            </p>
            <p>
              These terms constitute a legally binding agreement between you and Game Platform regarding your use of our services.
            </p>
          </div>
        </section>

        {/* Account Terms */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Account Terms</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>To use certain features of our platform, you must create an account. By creating an account, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Be at least 13 years of age</li>
            </ul>
          </div>
        </section>

        {/* User Conduct */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User Conduct</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our services</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Use automated systems to access our services</li>
            </ul>
          </div>
        </section>

        {/* Content and Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Content and Intellectual Property</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              All content on our platform, including games, text, graphics, logos, and software, is the property of Game Platform 
              or our licensors and is protected by intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of our services or included software, 
              nor may you reverse engineer or attempt to extract the source code of that software.
            </p>
          </div>
        </section>

        {/* User Content */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. User Content</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              You retain ownership of any content you submit, post, or display on or through our services. 
              By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
              reproduce, modify, adapt, publish, and display such content.
            </p>
            <p>
              You are responsible for ensuring that your content does not violate any laws or rights of third parties.
            </p>
          </div>
        </section>

        {/* Service Modifications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Service Modifications</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, our services with or without notice. 
              We shall not be liable to you or any third party for any modification, suspension, or discontinuance of our services.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Termination</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              We may terminate or suspend your account and access to our services immediately, without prior notice or liability, 
              for any reason, including if you breach these Terms of Service.
            </p>
            <p>
              Upon termination, your right to use our services will immediately cease. If you wish to terminate your account, 
              you may simply discontinue using our services.
            </p>
          </div>
        </section>

        {/* Disclaimer of Warranties */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Disclaimer of Warranties</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. 
              We do not warrant that our services will be uninterrupted, timely, secure, or error-free.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              In no event shall Game Platform, its directors, employees, partners, agents, suppliers, or affiliates be liable for 
              any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Governing Law</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law provisions.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, 
              we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact Us</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@gameplatform.com</li>
              <li>Address: 123 Gaming Street, San Francisco, CA 94107</li>
            </ul>
          </div>
          <Button asChild className="mt-4">
            <Link href="/contact" className="gap-2">
              Contact Support
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
} 