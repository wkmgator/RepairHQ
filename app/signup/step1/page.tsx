"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignupStep1() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return false
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirm: false, // We'll handle email confirmation later
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Store signup data in localStorage for the next steps
        localStorage.setItem(
          "signup_data",
          JSON.stringify({
            userId: data.user.id,
            email: email,
            step: 1,
          }),
        )
        router.push("/signup/step2")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
        <p className="text-slate-300">Enter your email and create a secure password</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400">Must be at least 8 characters long</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-200">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Business Type
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="text-xs text-slate-400 text-center">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="text-green-400 hover:text-green-300">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-green-400 hover:text-green-300">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}
