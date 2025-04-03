import Link from "next/link"
import { ArrowRight, Utensils, Users, Clock, MapPin, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroAnimation from "@/components/hero-animation"
import FeatureCard from "@/components/feature-card"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Animation */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-purple-900/80 to-purple-900" />

        <div className="container relative mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block rounded-lg bg-purple-950/60 px-3 py-1 text-sm backdrop-blur">
              <span className="text-purple-200">INNOVEX CODECRAFT</span>
            </div>

            <h1 className="font-pixel text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              COMMUNITY
              <br />
              KITCHEN
              <br />
              NETWORK
            </h1>

            <p className="text-xl text-purple-100">
              Connect donors, community kitchens, and food seekers through a technology-driven food redistribution
              system.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-400 text-white">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-400 text-purple-100 hover:bg-purple-800/50"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px]">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Our System Works</h2>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<Utensils />}
                title="Identify & Distribute Food"
                description="Efficiently connect surplus food with those who need it most through our smart matching system."
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<Users />}
                title="Real-time Coordination"
                description="Enable seamless communication between donors, kitchens, and recipients."
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <FeatureCard
                icon={<Clock />}
                title="Online & Offline Access"
                description="Ensure inclusivity with both app and SMS-based interaction options."
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <FeatureCard
                icon={<MapPin />}
                title="Optimized Logistics"
                description="Smart routing and scheduling for efficient food pickup and delivery."
              />
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <FeatureCard
                icon={<ShieldCheck />}
                title="Food Safety"
                description="Promote responsible donations with safety guidelines and verification."
              />
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <FeatureCard
                icon={<Utensils />}
                title="Community Building"
                description="Foster a sustainable, community-driven meal-sharing network."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="font-pixel text-3xl md:text-4xl font-bold mb-8">GOAL</h2>
            <p className="text-xl md:text-2xl leading-relaxed">
              To reduce food waste, enhance food security, and foster a sustainable, community-driven meal-sharing
              network.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Button asChild size="lg" className="mt-12 bg-white text-purple-900 hover:bg-purple-100">
              <Link href="/join">
                Join Our Mission <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}

