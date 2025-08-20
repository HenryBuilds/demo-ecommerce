"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Template Shop
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              A modern demo storefront — purchases are not possible.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link 
              href="https://twitter.com" 
              target="_blank" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Twitter
            </Link>
            <Link 
              href="https://github.com" 
              target="_blank" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Template Shop. Demo project for showcase purposes only.
        </div>
      </div>
    </footer>
  )
}
