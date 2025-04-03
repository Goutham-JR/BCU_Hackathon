"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, MapPin, Utensils, Heart, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/food-map", label: "Find Food", icon: <MapPin className="h-4 w-4 mr-2" /> },
    { href: "/donate", label: "Donate", icon: <Utensils className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About Us", icon: <Heart className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <span className="font-pixel text-xl font-bold text-purple-800">COMMUNITY KITCHEN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-purple-800",
                pathname === item.href ? "text-purple-800" : "text-gray-600",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label={isOpen ? "Close Menu" : "Open Menu"}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white md:hidden">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-2 text-base font-medium transition-colors hover:text-purple-800",
                  pathname === item.href ? "text-purple-800" : "text-gray-600",
                )}
                onClick={closeMenu}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/login" onClick={closeMenu}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <Link href="/register" onClick={closeMenu}>
                  <User className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

