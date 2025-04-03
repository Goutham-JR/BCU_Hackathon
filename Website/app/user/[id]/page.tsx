"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Drumstick,
  Star,
  Utensils,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SimpleMap from "@/components/simple-map"

// Mock user data
const USER_DATA = {
  id: "user1",
  name: "Sarah Johnson",
  avatar: "/placeholder.svg?height=100&width=100",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY",
  bio: "Community kitchen volunteer and food enthusiast. I love sharing homemade meals with those in need.",
  joinedDate: "March 2023",
  rating: 4.8,
  reviews: 24,
  location: { lat: 40.712, lng: -74.006 },
}

// Mock food listings by this user
const USER_FOOD_LISTINGS = [
  {
    id: 1,
    title: "Homemade Vegetable Curry",
    description:
      "Freshly made vegetable curry with rice. Can serve 4-5 people. Made with organic vegetables and mild spices, suitable for all ages.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Curry+1",
      "/placeholder.svg?height=400&width=600&text=Curry+2",
      "/placeholder.svg?height=400&width=600&text=Curry+3",
    ],
    prepTime: "2 hours ago",
    isVeg: true,
    servings: 5,
    distance: "0.8 miles",
    location: { lat: 40.712, lng: -74.006 },
  },
  {
    id: 2,
    title: "Homemade Bread Loaves",
    description: "Freshly baked whole wheat bread. 3 loaves available. Made this morning with organic flour.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Bread+1",
      "/placeholder.svg?height=400&width=600&text=Bread+2",
    ],
    prepTime: "5 hours ago",
    isVeg: true,
    servings: 3,
    distance: "0.8 miles",
    location: { lat: 40.712, lng: -74.006 },
  },
]

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const foodId = searchParams.get("food") ? Number.parseInt(searchParams.get("food") as string) : null

  const [selectedFood, setSelectedFood] = useState<(typeof USER_FOOD_LISTINGS)[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "other" }[]>([])

  // Find the selected food based on URL parameter
  useEffect(() => {
    if (foodId) {
      const food = USER_FOOD_LISTINGS.find((f) => f.id === foodId)
      if (food) {
        setSelectedFood(food)
      }
    } else if (USER_FOOD_LISTINGS.length > 0) {
      setSelectedFood(USER_FOOD_LISTINGS[0])
    }
  }, [foodId])

  const nextImage = () => {
    if (selectedFood) {
      setCurrentImageIndex((currentImageIndex + 1) % selectedFood.images.length)
    }
  }

  const prevImage = () => {
    if (selectedFood) {
      setCurrentImageIndex((currentImageIndex - 1 + selectedFood.images.length) % selectedFood.images.length)
    }
  }

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }])
      setMessage("")

      // Simulate response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thanks for your interest! Yes, the food is still available. When would you like to pick it up?",
            sender: "other",
          },
        ])
      }, 1000)
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
                <AvatarFallback>{USER_DATA.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{USER_DATA.name}</CardTitle>
            <CardDescription className="flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              {USER_DATA.rating} ({USER_DATA.reviews} reviews)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{USER_DATA.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">{USER_DATA.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-gray-600">{USER_DATA.joinedDate}</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-600">{USER_DATA.bio}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setChatOpen(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact {USER_DATA.name.split(" ")[0]}
            </Button>
          </CardFooter>
        </Card>

        {/* Food Details */}
        <Card className="md:col-span-2">
          {selectedFood && (
            <>
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedFood.images[currentImageIndex] || "/placeholder.svg"}
                  alt={selectedFood.title}
                  fill
                  className="object-cover"
                />

                {/* Image navigation */}
                {selectedFood.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedFood.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <Badge className={`absolute top-4 right-4 ${selectedFood.isVeg ? "bg-green-500" : "bg-orange-500"}`}>
                  {selectedFood.isVeg ? (
                    <span className="flex items-center">
                      <Leaf className="h-3 w-3 mr-1" /> Vegetarian
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Drumstick className="h-3 w-3 mr-1" /> Non-Vegetarian
                    </span>
                  )}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{selectedFood.title}</CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Prepared {selectedFood.prepTime}
                  </span>
                  <span className="flex items-center">
                    <Utensils className="h-4 w-4 mr-1" />
                    Serves {selectedFood.servings}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700">{selectedFood.description}</p>

                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Pickup Location</h3>
                  <div className="h-48 w-full rounded-lg overflow-hidden border">
                    <SimpleMap
                      listings={[
                        {
                          ...selectedFood,
                          id: selectedFood.id,
                          userId: USER_DATA.id,
                          timePosted: selectedFood.prepTime,
                        },
                      ]}
                      selectedListing={selectedFood.id}
                      setSelectedListing={() => {}}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Approximate location shown. Exact pickup details will be shared after contact.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/food-map">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Listings
                  </Link>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setChatOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Request This Food
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Other Food by this User */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">More Food from {USER_DATA.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USER_FOOD_LISTINGS.map((food) => (
              <Link
                href={`/user/${params.id}?food=${food.id}`}
                key={food.id}
                className={selectedFood?.id === food.id ? "pointer-events-none" : ""}
              >
                <Card
                  className={`overflow-hidden hover:shadow-lg transition-shadow ${
                    selectedFood?.id === food.id ? "border-2 border-purple-500" : ""
                  }`}
                >
                  <div className="relative h-48 w-full">
                    <Image src={food.images[0] || "/placeholder.svg"} alt={food.title} fill className="object-cover" />
                    <Badge className={`absolute top-2 right-2 ${food.isVeg ? "bg-green-500" : "bg-orange-500"}`}>
                      {food.isVeg ? (
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
                    <h3 className="font-semibold text-lg mb-1">{food.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {food.prepTime}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
                <AvatarFallback>{USER_DATA.name.charAt(0)}</AvatarFallback>
              </Avatar>
              Chat with {USER_DATA.name}
            </DialogTitle>
            <DialogDescription>Discuss pickup details and ask questions about the food</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-[300px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

