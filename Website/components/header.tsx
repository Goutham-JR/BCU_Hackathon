"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, MapPin, Utensils, Heart, User, LogIn, ChevronDown, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-auth", { credentials: "include",  })
        const data = await response.json();

        if (response.ok) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed", error)
        setUser(null)
      }
    }
    checkAuth()
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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

        {/* Right Side - Auth/Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            // Profile Dropdown
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <img src={user.profileImage} alt="Profile" className="h-8 w-8 rounded-full border" />
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <Link href="/profile" className="flex items-center p-2 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center p-2 text-left hover:bg-gray-100">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login & Register Buttons
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label={isOpen ? "Close Menu" : "Open Menu"}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white md:hidden">
          <nav className="container mx-auto bg-white px-4 py-6 flex flex-col space-y-4">
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
              {user ? (
                <>
                  <Link href="/profile" onClick={closeMenu} className="flex items-center p-2">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center p-2 text-left hover:bg-gray-100">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
