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
  const [images, setImages] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [maxQuantity, setMaxQuantity] = useState(20)
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('today');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [confirmationError, setConfirmationError] = useState("");

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      setConfirmationError("You must confirm the food safety statement");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    // Using FormData for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("foodType", foodType);
    formData.append("preparationTime", preparationTime);
    formData.append("quantity", quantity);
    formData.append("location", location); // Ensure location is a string or JSON.stringify(location)
    formData.append("donorId", "current-user-id"); // Replace with real user ID
    formData.append("status", "available");

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }

    // try {
    //   const response = await fetch("http://localhost:5000/api/donate/donation", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`, // No 'Content-Type' for FormData
    //     },
    //     body: formData,
    //     credentials: "include",
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     setErrorMessage(data.message || "Failed to post donation");
    //     return;
    //   }

    //   console.log("Donation posted successfully", data);
    //   setShowSuccess(true);


    //   setIsConfirmed(false);
    // } catch (error) {
    //   setErrorMessage("Network error. Please try again later.");
    //   console.error("Donation submission error:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const newImages = Array.from(files)
      .slice(0, 5 - images.length)
      .map(file => {
        if (!file.type.startsWith('image/')) {
          alert('Please upload only image files');
          return null;
        }
        return URL.createObjectURL(file);
      })
      .filter(img => img !== null) as string[];
  
    setImages(prev => [...prev, ...newImages]);
  };
  

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
            <form onSubmit={handleSubmit} className="space-y-6" >
              {/* Food Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Food Title</Label>
                <Input id="title" name="title" placeholder="E.g., Homemade Vegetable Curry" value={title} onValueChange={setTitle} required />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the food, quantity, and any other relevant details..."
                  rows={4}
                  value={description} onValueChange={setDescription}
                  required
                />
              </div>

              {/* Food Type and Preparation Time */}
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
                      if (newValue >= maxQuantity - 5) {
                        setMaxQuantity(maxQuantity + 10)
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{quantity}</span>
                </div>
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
                    className="mt-0.5"  // Small vertical adjustment
                    required 
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that this food is safe for consumption and I have followed proper food handling practices.
                  </span>
                </Label>
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