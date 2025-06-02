"use client"

import type React from "react"
import { Wrench, CheckCircle } from "lucide-react"
import { usePathname } from "next/navigation"

const steps = [
  { number: 1, title: "Account", path: "/signup/step1" },
  { number: 2, title: "Business Type", path: "/signup/step2" },
  { number: 3, title: "Business Info", path: "/signup/step3" },
  { number: 4, title: "Choose Plan", path: "/signup/step4" },
  { number: 5, title: "Complete", path: "/signup/complete" },
]

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentStep = steps.find((step) => pathname === step.path)?.number || 1

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-green-500 mr-2" />
            <h1 className="text-3xl font-bold">RepairHQ</h1>
          </div>
          <p className="text-slate-300">Create your repair business account</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step.number < currentStep
                      ? "bg-green-500 text-white"
                      : step.number === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step.number < currentStep ? <CheckCircle className="w-5 h-5" /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all ${
                      step.number < currentStep ? "bg-green-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            {steps.map((step) => (
              <span key={step.number} className="text-center">
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl shadow-xl p-8">{children}</div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-green-400 hover:text-green-300">
            Sign in
          </a>
        </div>
      </div>
    </main>
  )
}
