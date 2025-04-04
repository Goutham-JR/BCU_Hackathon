"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password: string) => password.length >= 6

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Validate on change
    switch (name) {
      case "email":
        setErrors({
          ...errors,
          email: validateEmail(value) ? "" : "Please enter a valid email"
        })
        break
      case "password":
        setErrors({
          ...errors,
          password: validatePassword(value) ? "" : "Password must be at least 6 characters"
        })
        break
      default:
        break
    }
  }

  const validateForm = () => {
    const isValid = 
      validateEmail(formData.email) && 
      validatePassword(formData.password)
    
    if (!isValid) {
      toast.error("Please fix the errors in the form before submitting")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()
  
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid email or password")
        } else if (response.status === 404) {
          toast.error("User not found")
        } else {
          toast.error(data.message || 'Failed to login')
        }
        return
      }
  
      // Store token in localStorage or cookies if needed
      document.cookie = `token=${data.token}; path=/;`
      toast.success("Login successful!")
      window.location.href = "/food-map"
    } catch (error) {
      toast.error('Network error. Please try again later.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-pixel">WELCOME BACK</CardTitle>
            <CardDescription className="text-purple-100">Log in to your Community Kitchen account</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot" className="text-xs text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}