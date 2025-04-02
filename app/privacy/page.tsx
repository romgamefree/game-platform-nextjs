import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - Game Platform",
  description: "Learn about how Game Platform collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              At Game Platform, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site or use our services.
            </p>
          </div>
        </section>

        {/* Information Collection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <div className="prose prose-gray dark:prose-invert">
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our support channels</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you access our website, we automatically collect certain information about your device, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Access times</li>
              <li>Pages viewed</li>
            </ul>
          </div>
        </section>

        {/* Use of Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and promotions</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information Sharing</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Third parties in connection with a business transfer</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your personal information, 
              we cannot guarantee its absolute security.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Children's Privacy</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              Our services are not intended for children under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe that 
              your child has provided us with personal information, please contact us.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
            </ul>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@gameplatform.com</li>
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