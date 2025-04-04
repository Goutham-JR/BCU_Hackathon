"use client"

import { useState, useRef } from "react"
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
import { toast } from "sonner"
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
  const [foodType, setFoodType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [maxQuantity, setMaxQuantity] = useState(20)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [preparationTime, setPreparationTime] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    foodType: '',
    preparationTime: '',
    quantity: '',
    location: '',
    confirmation: ''
  })

  // Validation functions
  const validateTitle = (title: string) => /^[A-Za-z\s]+$/.test(title)
  const validateDescription = (desc: string) => desc.length >= 10 && /^[A-Za-z\s.,!?]+$/.test(desc)
  const validateQuantity = (qty: number) => qty >= 5

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      title: validateTitle(title) ? '' : 'Title must contain only letters and spaces',
      description: validateDescription(description) ? '' : 'Description must be at least 10 characters with only letters and basic punctuation',
      foodType: foodType ? '' : 'Please select a food type',
      preparationTime: preparationTime ? '' : 'Please select preparation time',
      quantity: validateQuantity(quantity) ? '' : 'Quantity must be at least 5 servings',
      location: location ? '' : 'Please select pickup location',
      confirmation: isConfirmed ? '' : 'You must confirm the food safety statement'
    }

    setErrors(newErrors)

    // Check if any errors exist
    if (Object.values(newErrors).some(error => error !== '')) {
      toast.error('Please fill all the fields')
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    // Using FormData for file uploads
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("foodType", foodType)
    formData.append("preparationTime", preparationTime)
    formData.append("quantity", quantity.toString())
    formData.append("location", JSON.stringify(location))
    formData.append("donorId", "current-user-id") // Replace with real user ID
    formData.append("status", "available")

    // Append each image file
    if (fileInputRef.current?.files) {
      Array.from(fileInputRef.current.files).forEach(file => {
        formData.append("images", file)
      })
    }

    try {
      const response = await fetch("http://localhost:5000/api/donate/donation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to post donation")
      }

      toast.success("Donation posted successfully!")
      setShowSuccess(true)
    } catch (error) {
      console.error("Donation submission error:", error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
  
    const newImages = Array.from(files)
      .slice(0, 5 - images.length)
      .map(file => {
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files')
          return null
        }
        return URL.createObjectURL(file)
      })
      .filter(img => img !== null) as string[]
  
    setImages(prev => [...prev, ...newImages])
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setErrors(prev => ({ ...prev, location: '' }))
        setIsLoading(false)
      },
      (err) => {
        setError("Unable to retrieve your location: " + err.message)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
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
            {errorMessage && (
              <p className="text-sm text-red-600 py-2">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Food Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="E.g., Homemade Vegetable Curry" 
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setErrors(prev => ({ ...prev, title: '' }))
                  }} 
                  required 
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the food, quantity, and any other relevant details..."
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setErrors(prev => ({ ...prev, description: '' }))
                  }}
                  required
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Food Type and Preparation Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Food Type</Label>
                  <RadioGroup 
                    value={foodType} 
                    onValueChange={(value) => {
                      setFoodType(value)
                      setErrors(prev => ({ ...prev, foodType: '' }))
                    }} 
                    className="grid grid-cols-2 gap-4"
                  >
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
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetables" id="vegetables" />
                      <Label htmlFor="vegetables" className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Vegetables
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fruits" id="fruits" />
                      <Label htmlFor="fruits" className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fruits
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.foodType && <p className="text-xs text-red-500 mt-1">{errors.foodType}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Preparation Time</Label>
                  <Select 
                    value={preparationTime}
                    onValueChange={(value) => {
                      setPreparationTime(value)
                      setErrors(prev => ({ ...prev, preparationTime: '' }))
                    }}
                  >
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
                  {errors.preparationTime && <p className="text-xs text-red-500 mt-1">{errors.preparationTime}</p>}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="space-y-2">
                <Label>Quantity (Servings)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[Math.min(quantity, maxQuantity)]}
                    min={1}
                    max={maxQuantity}
                    step={1}
                    onValueChange={(value) => {
                      const newValue = value[0]
                      setQuantity(newValue)
                      setErrors(prev => ({ ...prev, quantity: '' }))
                      if (newValue >= maxQuantity - 5) {
                        setMaxQuantity(maxQuantity + 10)
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{quantity}</span>
                </div>
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
              </div>

              {/* Location Picker */}
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Use Current Location
                    </>
                  )}
                </Button>
                {location && (
                  <p className="text-sm text-green-600">
                    Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                <p className="text-xs text-gray-500">
                  For safety, your exact coordinates will only be shared when you approve a request
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative h-32 rounded-md overflow-hidden border">
                      <Image
                        src={image}
                        alt={`Food image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    <>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="h-32 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-600 transition-colors"
                      >
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Add Image</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images. Clear photos help recipients identify your food.
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <div className="space-y-2">
                <Label className="flex items-start gap-2">
                  <Input 
                    type="checkbox" 
                    className="mt-0.5"
                    checked={isConfirmed}
                    onChange={(e) => {
                      setIsConfirmed(e.target.checked)
                      setErrors(prev => ({ ...prev, confirmation: '' }))
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that this food is safe for consumption and I have followed proper food handling practices.
                  </span>
                </Label>
                {errors.confirmation && <p className="text-xs text-red-500">{errors.confirmation}</p>}
              </div>

              {/* Submit Button */}
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