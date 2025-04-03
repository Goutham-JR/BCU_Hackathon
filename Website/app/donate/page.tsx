"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Loader2, Upload, X, Leaf, Drumstick, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DonatePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [foodType, setFoodType] = useState("veg")
  const [quantity, setQuantity] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
    }, 1500)
  }

  const handleImageUpload = () => {
    // In a real app, this would handle file uploads
    // For demo purposes, we'll add placeholder images
    if (images.length < 5) {
      setImages([...images, `/placeholder.svg?height=200&width=300&text=Food+Image+${images.length + 1}`])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-pixel">DONATE FOOD</CardTitle>
            <CardDescription className="text-purple-100">
              Share your surplus food with those who need it
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Food Title</Label>
                <Input id="title" placeholder="E.g., Homemade Vegetable Curry" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the food, quantity, and any other relevant details..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Food Type</Label>
                  <RadioGroup value={foodType} onValueChange={setFoodType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="veg" id="veg" />
                      <Label htmlFor="veg" className="flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-green-600" />
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nonveg" id="nonveg" />
                      <Label htmlFor="nonveg" className="flex items-center">
                        <Drumstick className="h-4 w-4 mr-1 text-orange-600" />
                        Non-Vegetarian
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Preparation Time</Label>
                  <Select defaultValue="today">
                    <SelectTrigger>
                      <SelectValue placeholder="Select when it was prepared" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Just Now</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="older">Older</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantity (Servings)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[quantity]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setQuantity(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{quantity}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <div className="flex space-x-2">
                  <Input placeholder="Enter your address" className="flex-1" required />
                  <Button type="button" variant="outline" className="flex-shrink-0">
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  For safety, your exact address will only be shared when you approve a request
                </p>
              </div>

              <div className="space-y-2">
                <Label>Upload Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative h-32 rounded-md overflow-hidden border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Food image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="h-32 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-600 transition-colors"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add Image</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images. Clear photos help recipients identify your food.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-start">
                  <Input type="checkbox" className="mt-1 mr-2" required />
                  <span className="text-sm text-gray-600">
                    I confirm that this food is safe for consumption and I have followed proper food handling practices.
                  </span>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting Donation...
                  </>
                ) : (
                  "Post Food Donation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Donation Posted Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your food donation has been posted and is now visible to people in your area. You'll receive notifications
              when someone is interested.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => (window.location.href = "/food-map")}
              >
                View All Listings
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

