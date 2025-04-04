"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, Mail, ChevronLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"request" | "verify" | "success">("request")
  const [countdown, setCountdown] = useState(0)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password: string) => password.length >= 8
  const validateOtp = (otp: string) => /^\d{4}$/.test(otp)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
  
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("User not found")
        } else {
          toast.error(data.message || 'Failed to send reset code')
        }
        return
      }
  
      setStep("verify")
      startCountdown()
      toast.success(`Reset code sent to ${email}`)
    } catch (error) {
      toast.error('Network error. Please try again later.')
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
  
      if (!response.ok) {
        toast.error(data.message || 'Failed to resend reset code')
        return
      }
  
      startCountdown()
      toast.success(`New reset code sent to ${email}`)
    } catch (error) {
      toast.error('Network error. Please try again later.')
      console.error('Resend code error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOtp(otp)) {
      toast.error("Please enter a valid 4-digit code")
      return
    }
    
    if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 8 characters")
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: otp,
          newPassword
        }),
      })

      const data = await response.json()
  
      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Invalid or expired reset code")
        } else {
          toast.error(data.message || 'Failed to reset password')
        }
        return
      }
  
      setStep("success")
      toast.success("Password reset successfully!")
    } catch (error) {
      toast.error('Network error. Please try again later.')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(30)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) clearInterval(timer)
        return prev - 1
      })
    }, 1000)
  }

  const resetForm = () => {
    setStep("request")
    setEmail("")
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setCountdown(0)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          asChild 
          className="mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/login">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to login
          </Link>
        </Button>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-pixel">
              {step === "request" ? "RESET PASSWORD" : 
               step === "verify" ? "VERIFY CODE" : "PASSWORD RESET"}
            </CardTitle>
            <CardDescription className="text-purple-100">
              {step === "request" ? "Enter your email to receive a reset code" :
               step === "verify" ? "Enter the code and new password" :
               "Your password has been reset successfully"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {step === "success" ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Password Updated!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can now log in with your new password.
                </p>
                <Button 
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : step === "verify" ? (
              <form onSubmit={handleVerify} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/90">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Reset Code</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setOtp(e.target.value)
                      }
                    }}
                    placeholder="Enter the 4-digit code"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Sent to {email} • {countdown > 0 ? `Resend in ${countdown}s` : (
                      <button 
                        type="button" 
                        onClick={handleResend}
                        className="text-purple-600 hover:underline"
                        disabled={isLoading}
                      >
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/90">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    name="email"
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                  <p className="text-xs text-gray-500">
                    Enter the email associated with your account
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          {step === "request" && (
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link href="/login" className="text-purple-600 hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  )
}