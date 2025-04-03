"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, MapPin, Clock, Filter, ChevronDown, Utensils, Leaf, Drumstick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleMap from "@/components/simple-map"

// Mock data for food listings
const FOOD_LISTINGS = [
  {
    id: 1,
    title: "Homemade Vegetable Curry",
    description: "Freshly made vegetable curry with rice. Can serve 4-5 people.",
    image: "/placeholder.svg?height=200&width=300",
    distance: "0.8 miles",
    timePosted: "30 minutes ago",
    isVeg: true,
    userId: "user1",
    location: { lat: 13.00346, lng: 77.63092 },
  },
  {
    id: 2,
    title: "Leftover Pizza from Event",
    description: "10 boxes of pizza from a canceled event. Various toppings available.",
    image: "/placeholder.svg?height=200&width=300",
    distance: "1.2 miles",
    timePosted: "1 hour ago",
    isVeg: false,
    userId: "user2",
    location: { lat: 13.06817, lng: 77.78824 },
  },
  {
    id: 3,
    title: "Fresh Baked Bread",
    description: "12 loaves of freshly baked bread from our bakery.",
    image: "/placeholder.svg?height=200&width=300",
    distance: "0.5 miles",
    timePosted: "15 minutes ago",
    isVeg: true,
    userId: "user3",
    location: { lat: 13.02937, lng: 77.53693 },
  },
  {
    id: 4,
    title: "Catered Lunch Extras",
    description: "Sandwiches, salads, and desserts from office lunch.",
    image: "/placeholder.svg?height=200&width=300",
    distance: "1.5 miles",
    timePosted: "2 hours ago",
    isVeg: false,
    userId: "user4",
    location: { lat: 12.87613, lng: 77.57950 },
  },
]

export default function FoodMapPage() {
  const [view, setView] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [foodType, setFoodType] = useState<"all" | "veg" | "nonveg">("all")
  const [selectedListing, setSelectedListing] = useState<number | null>(null)

  // Filter listings based on search and food type
  const filteredListings = FOOD_LISTINGS.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFoodType =
      foodType === "all" || (foodType === "veg" && listing.isVeg) || (foodType === "nonveg" && !listing.isVeg)

    return matchesSearch && matchesFoodType
  })

  return (
    <main className="container mx-auto py-6 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Food Available Nearby</h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search for food..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFoodType("all")}>
                    <Utensils className="mr-2 h-4 w-4" />
                    <span>All Food Types</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFoodType("veg")}>
                    <Leaf className="mr-2 h-4 w-4 text-green-600" />
                    <span>Vegetarian Only</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFoodType("nonveg")}>
                    <Drumstick className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Non-Vegetarian</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs defaultValue="list" className="w-[200px]">
              <TabsList>
                <TabsTrigger value="list" onClick={() => setView("list")} className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="map" onClick={() => setView("map")} className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Food Listings */}
          <div className="mt-6">
            {view === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Link href={`/user/${listing.userId}?food=${listing.id}`} key={listing.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full">
                        <Image
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${listing.isVeg ? "bg-green-500" : "bg-orange-500"}`}>
                          {listing.isVeg ? (
                            <span className="flex items-center">
                              <Leaf className="h-3 w-3 mr-1" /> Veg
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Drumstick className="h-3 w-3 mr-1" /> Non-Veg
                            </span>
                          )}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                      </CardContent>
                      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {listing.distance}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {listing.timePosted}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-[600px] w-full rounded-lg overflow-hidden border">
                <SimpleMap
                  listings={filteredListings}
                  selectedListing={selectedListing}
                  setSelectedListing={setSelectedListing}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  )
}

