"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("seeker")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here in a real app
      window.location.href = "/food-map"
    }, 1500)
  }

  const nextStep = () => setStep(step + 1)
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
                    <Input id="name" placeholder="Enter your full name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(123) 456-7890" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" required />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters with a number and special character
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
                    <Input id="address" placeholder="123 Main St" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="ZIP" required />
                    </div>
                  </div>

                  {userType === "kitchen" && (
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-name">Kitchen Name</Label>
                      <Input id="kitchen-name" placeholder="Name of your community kitchen" required />
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

