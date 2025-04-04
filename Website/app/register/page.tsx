"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("seeker")
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    zip: "",
    kitchenName: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    zip: "",
    kitchenName: ""
  })

    const[user, setUserData] = useState({})
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/check-auth`, {
            credentials: "include",
          });
  
          if (response.ok) {
            throw new Error("Not authenticated");
          }
          const data = await response.json();
  
          setUserData(data.user);
  
        } catch (error) {
          console.error("Auth check failed:", error);
          router.replace("/")
        }
      };
  
      checkAuth();
    }, []);

  // Validation functions
  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name)
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone)
  const validatePassword = (password: string) => password.length >= 6
  const validateAddress = (address: string) => address.trim().length > 0
  const validateCity = (city: string) => /^[A-Za-z\s]+$/.test(city)
  const validateZip = (zip: string) => /^\d{6}$/.test(zip)
  const validateKitchenName = (name: string) => name.trim().length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    switch (name) {
      case "name":
        setErrors({
          ...errors,
          name: validateName(value) ? "" : "Name should contain only letters"
        })
        break
      case "email":
        setErrors({
          ...errors,
          email: validateEmail(value) ? "" : "Please enter a valid email"
        })
        break
      case "phone":
        setErrors({
          ...errors,
          phone: validatePhone(value) ? "" : "Please enter a valid 10-digit Indian phone number"
        })
        break
      case "password":
        setErrors({
          ...errors,
          password: validatePassword(value) ? "" : "Password must be at least 6 characters"
        })
        break
      case "address":
        setErrors({
          ...errors,
          address: validateAddress(value) ? "" : "Street address is required"
        })
        break
      case "city":
        setErrors({
          ...errors,
          city: validateCity(value) ? "" : "City should contain only letters"
        })
        break
      case "zip":
        setErrors({
          ...errors,
          zip: validateZip(value) ? "" : "ZIP code must be 6 digits"
        })
        break
      case "kitchenName":
        setErrors({
          ...errors,
          kitchenName: validateKitchenName(value) ? "" : "Kitchen name is required"
        })
        break
      default:
        break
    }
  }

  const validateStep = (step: number) => {
    if (step === 2) {
      const isValid = 
        validateName(formData.name) &&
        validateEmail(formData.email) &&
        validatePhone(formData.phone) &&
        validatePassword(formData.password)
      
      if (!isValid) {
        toast.error("Please enter the required details")
        return false
      }
    } else if (step === 3) {
      const isValid = 
        validateAddress(formData.address) &&
        validateCity(formData.city) &&
        validateZip(formData.zip) &&
        (userType !== "kitchen" || validateKitchenName(formData.kitchenName))
      
      if (!isValid) {
        toast.error("Please enter the required details")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    const userData = {
      userType,
      ...formData,
      kitchenName: userType === "kitchen" ? formData.kitchenName : "",
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (response.status === 401) {
        toast.error("User already exists with this email");
      } 
  
      if (response.ok) {
        toast.success("Registration successful!")
        router.replace("/login")
      } else {
        toast.error("User already exists with this email")
      }
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-pixel">JOIN THE NETWORK</CardTitle>
            <CardDescription className="text-purple-100">
              Create your account to connect with the community
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-1/3 h-1 rounded-full mx-1 ${i <= step ? "bg-purple-600" : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-center text-gray-500">
                Step {step} of 3: {step === 1 ? "Account Type" : step === 2 ? "Personal Info" : "Verification"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium">How will you use the platform?</h3>
                      <p className="text-sm text-gray-500">Select your primary role</p>
                    </div>

                    <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-1 gap-4">
                      <Label
                        htmlFor="seeker"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          userType === "seeker" ? "border-purple-600 bg-purple-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="seeker" id="seeker" className="sr-only" />
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <span className="font-medium">Food Seeker</span>
                        <span className="text-sm text-gray-500 text-center mt-1">I'm looking for available food</span>
                      </Label>

                      <Label
                        htmlFor="donor"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          userType === "donor" ? "border-purple-600 bg-purple-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="donor" id="donor" className="sr-only" />
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                          <span className="text-2xl">🎁</span>
                        </div>
                        <span className="font-medium">Food Donor</span>
                        <span className="text-sm text-gray-500 text-center mt-1">I want to donate surplus food</span>
                      </Label>

                      <Label
                        htmlFor="kitchen"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          userType === "kitchen" ? "border-purple-600 bg-purple-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="kitchen" id="kitchen" className="sr-only" />
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                          <span className="text-2xl">👨‍🍳</span>
                        </div>
                        <span className="font-medium">Community Kitchen</span>
                        <span className="text-sm text-gray-500 text-center mt-1">I operate a community kitchen</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="mt-6">
                    <Button type="button" onClick={nextStep} className="w-full bg-purple-600 hover:bg-purple-700">
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your full name"  
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="98XXXXXXXX" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="Create a password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      placeholder="123 Main St" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required 
                      />
                      {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        name="zip" 
                        placeholder="6-digit ZIP" 
                        value={formData.zip} 
                        onChange={handleChange} 
                        required 
                        maxLength={6}
                      />
                      {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}
                    </div>
                  </div>

                  {userType === "kitchen" && (
                    <div className="space-y-2">
                      <Label htmlFor="kitchenName">Kitchen Name</Label>
                      <Input 
                        id="kitchenName" 
                        name="kitchenName" 
                        placeholder="Name of your community kitchen" 
                        value={formData.kitchenName} 
                        onChange={handleChange} 
                        required={userType === "kitchen"}
                      />
                      {errors.kitchenName && <p className="text-xs text-red-500">{errors.kitchenName}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-start">
                      <Input type="checkbox" className="mt-1 mr-2" required />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="#" className="text-purple-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </Label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}