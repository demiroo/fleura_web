import Link from "next/link";
import LogoIcon from "@/components/icons/logo";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <LogoIcon className="h-8 w-auto" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium fresh flowers delivered with care. Transform every moment into something extraordinary with our expert floral arrangements.
            </p>
            <div className="text-sm text-muted-foreground">
              📍 Downtown Flower District<br />
              📞 (555) 123-BLOOM<br />
              ✉️ hello@fleura.com
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/search/bouquets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Fresh Bouquets
              </Link>
              <Link href="/search/wedding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Wedding Flowers
              </Link>
              <Link href="/search/arrangements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Custom Arrangements
              </Link>
              <Link href="/search/plants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Indoor Plants
              </Link>
            </nav>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Customer Care</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/delivery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Delivery Info
              </Link>
              <Link href="/care-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Flower Care Guide
              </Link>
              <Link href="/return-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Return Policy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Fleura
              </Link>
              <Link href="/sustainability" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sustainability
              </Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="/press" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Press Kit
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Fleura. All rights reserved. Made with 🌸 for flower lovers.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
