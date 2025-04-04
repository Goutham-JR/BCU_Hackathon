import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Global CSS import
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Community Kitchen Network",
  description:
    "A technology-driven food redistribution system connecting donors, community kitchens, and food seekers.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
          {children}
          <Toaster position="top-center" richColors /> {/* Toaster component */}
        </ThemeProvider>
      </body>
    </html>
  )
}