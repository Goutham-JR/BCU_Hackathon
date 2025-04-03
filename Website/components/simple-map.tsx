"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Leaf, Drumstick } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Location {
  lat: number
  lng: number
}

interface FoodListing {
  id: number
  title: string
  description: string
  image: string
  distance: string
  timePosted: string
  isVeg: boolean
  userId: string
  location: Location
}

interface SimpleMapProps {
  listings: FoodListing[]
  selectedListing: number | null
  setSelectedListing: (id: number | null) => void
}

export default function SimpleMap({ listings, selectedListing, setSelectedListing }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<Location>({ lat: 40.712, lng: -74.006 })

  // Initialize map
  useEffect(() => {
    // In a real app, we would use a proper map library like Google Maps or Mapbox
    // For this demo, we'll create a simple visual representation
    setMapLoaded(true)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.log("Unable to retrieve your location")
        },
      )
    }
  }, [])

  return (
    <div ref={mapRef} className="relative w-full h-full bg-gray-100">
      {/* Simple map visualization */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjZGRkZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')]"></div>

      {/* User location marker */}
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: `${50 + (userLocation.lng - 40.712) * 100}%`,
          top: `${50 - (userLocation.lat - -74.006) * 100}%`,
        }}
      >
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          You are here
        </span>
      </div>

      {/* Food listing markers */}
      {listings.map((listing) => {
        const isSelected = selectedListing === listing.id

        return (
          <div
            key={listing.id}
            className={`absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-all ${
              isSelected ? "scale-125 z-20" : "z-10"
            } ${listing.isVeg ? "bg-green-100" : "bg-orange-100"}`}
            style={{
              left: `${50 + (listing.location.lng - -74.006) * 100}%`,
              top: `${50 - (listing.location.lat - 40.712) * 100}%`,
              border: isSelected ? "3px solid purple" : "2px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onClick={() => setSelectedListing(isSelected ? null : listing.id)}
          >
            {listing.isVeg ? (
              <Leaf className="h-4 w-4 text-green-600" />
            ) : (
              <Drumstick className="h-4 w-4 text-orange-600" />
            )}

            {isSelected && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 w-64 z-30">
                <div className="flex flex-col">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{listing.distance}</span>
                    <Badge className={listing.isVeg ? "bg-green-500" : "bg-orange-500"}>
                      {listing.isVeg ? "Vegetarian" : "Non-Veg"}
                    </Badge>
                  </div>
                  <Button asChild className="mt-3 w-full bg-purple-600 hover:bg-purple-700">
                    <Link href={`/user/${listing.userId}?food=${listing.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

