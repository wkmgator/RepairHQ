import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Twitter, Github, Linkedin, Facebook } from "lucide-react" // Assuming Wrench is your logo icon

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()

  const footerNav = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/pricing" }, // Updated to /pricing
        { label: "Roadmap", href: "/roadmap" },
        { label: "Integrations", href: "/integrations" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "API Status", href: "/status" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Security", href: "/security" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ]

  const socialLinks = [
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "GitHub", href: "#", icon: Github },
    { label: "LinkedIn", href: "#", icon: Linkedin },
    { label: "Facebook", href: "#", icon: Facebook },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">RepairHQ</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/#features" className="text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-primary">
              Pricing
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/50 text-muted-foreground">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 mb-10">
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
              <Link href="/" className="flex items-center space-x-2 mb-3">
                <Wrench className="h-7 w-7 text-primary" />
                <span className="font-bold text-2xl text-foreground">RepairHQ</span>
              </Link>
              <p className="text-sm">
                The ultimate solution for repair shop management. Streamline operations, delight customers, and grow
                your business.
              </p>
            </div>
            {footerNav.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-8">
            <p className="text-xs">&copy; {currentYear} RepairHQ. All rights reserved. Built with passion.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
