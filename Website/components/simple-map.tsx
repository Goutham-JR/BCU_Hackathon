"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Leaf, Drumstick } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Define interfaces
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
  const [userLocation, setUserLocation] = useState<Location>({ lat: 12.97513, lng: 77.58390 })

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => console.log("Unable to retrieve your location")
      )
    }
  }, [])

  // Fix for missing default marker icons in Leaflet
  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconAnchor: [12, 41],
  })
  L.Marker.prototype.options.icon = defaultIcon

  return (
    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} className="h-[400px] w-full rounded-lg">
      {/* Tile layer for the map */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>
          <strong>You are here</strong>
        </Popup>
      </Marker>

      {/* Food listings markers */}
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.location.lat, listing.location.lng]}
          eventHandlers={{
            click: () => setSelectedListing(listing.id),
          }}
        >
          <Popup>
            <div className="flex flex-col">
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{listing.distance}</span>
                <Badge className={listing.isVeg ? "bg-green-500" : "bg-orange-500"}>
                  {listing.isVeg ? "Vegetarian" : "Non-Veg"}
                </Badge>
              </div>
              <Button asChild className="bg-purple-500 hover:bg-purple-400 text-white">
                <Link href={`/user/${listing.userId}?food=${listing.id}`}>View Details</Link>
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
