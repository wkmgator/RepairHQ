"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Wallet, CreditCard, Phone, MapPin, Globe, Check, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { Web3Service } from "@/lib/web3"
import { PhoneValidationService, countryPhoneData } from "@/lib/phone-validation"
import { AddressValidationService } from "@/lib/address-validation"
import { CurrencyService, currencies } from "@/lib/currency"
import { pricingPlans } from "@/components/pricing-plans"
import type { CountryCode } from "libphonenumber-js"

interface GlobalSignupFormProps {
  selectedPlan?: string
  billingCycle?: "monthly" | "annual"
  locale: string
  country?: string
}

export default function GlobalSignupForm({
  selectedPlan = "pro",
  billingCycle = "monthly",
  locale,
  country = "US",
}: GlobalSignupFormProps) {
  const t = useTranslations("signup")

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: country,
    currency: CurrencyService.getUserCurrency(locale, country),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    acceptTerms: false,
    marketingEmails: true,
  })

  // Validation states
  const [phoneValidation, setPhoneValidation] = useState<any>(null)
  const [addressValidation, setAddressValidation] = useState<any>(null)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [addressVerified, setAddressVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationId, setVerificationId] = useState("")

  // Web3 integration
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("USDC")

  // Currency and pricing
  const [localizedPrice, setLocalizedPrice] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState("$")

  useEffect(() => {
    // Calculate localized pricing
    const calculatePrice = async () => {
      const plan = pricingPlans.find((p) => p.id === selectedPlan)
      if (plan) {
        const converted = await CurrencyService.convertPrice(plan.price, "USD", formData.currency)
        setLocalizedPrice(billingCycle === "annual" ? converted * 10 : converted) // Annual discount
        setCurrencySymbol(currencies[formData.currency]?.symbol || "$")
      }
    }

    calculatePrice()
  }, [selectedPlan, billingCycle, formData.currency])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validatePhone = async () => {
    const result = PhoneValidationService.validate(formData.phone, formData.country as CountryCode)

    setPhoneValidation(result)

    if (result.isValid) {
      // Send SMS verification
      const smsResult = await PhoneValidationService.sendSMSVerification(
        formData.phone,
        formData.country as CountryCode,
      )

      if (smsResult.success) {
        setVerificationId(smsResult.verificationId!)
      } else {
        setError(smsResult.error!)
      }
    }
  }

  const verifyPhoneCode = async () => {
    const result = await PhoneValidationService.verifySMSCode(verificationId, verificationCode)

    if (result.success) {
      setPhoneVerified(true)
      setCurrentStep(3)
    } else {
      setError(result.error!)
    }
  }

  const validateAddress = async () => {
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`

    const result = await AddressValidationService.validateAddress(fullAddress, formData.country)

    setAddressValidation(result)

    if (result.isValid && result.confidence && result.confidence > 0.7) {
      setAddressVerified(true)
      setCurrentStep(4)
    } else if (result.suggestions?.length) {
      // Show address suggestions
    } else {
      setError(result.errorMessage || "Address validation failed")
    }
  }

  const connectWallet = async () => {
    const result = await Web3Service.connectWallet()

    if (result.success) {
      setWalletConnected(true)
      setWalletAddress(result.address!)
    } else {
      setError(result.error!)
    }
  }

  const processPayment = async () => {
    setLoading(true)

    try {
      if (paymentMethod === "crypto" && walletConnected) {
        // Process crypto payment
        const cryptoAmount = localizedPrice.toString()
        const tokenConfig = Object.values(Web3Service.web3Config.tokens).find(
          (token) => token.symbol === selectedCrypto,
        )

        const paymentResult = await Web3Service.sendPayment(cryptoAmount, tokenConfig?.address)

        if (!paymentResult.success) {
          throw new Error(paymentResult.error)
        }

        // Create account with crypto payment reference
        await createAccount({
          paymentMethod: "crypto",
          cryptoTxHash: paymentResult.txHash,
          cryptoToken: selectedCrypto,
        })
      } else {
        // Process traditional payment via Stripe
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            planId: selectedPlan,
            billingCycle,
            paymentMethod: "card",
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error)
        }

        // Redirect to Stripe checkout or success page
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl
        } else {
          // Account created successfully
          window.location.href = "/onboarding/success"
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (paymentData: any) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        planId: selectedPlan,
        billingCycle,
        ...paymentData,
        phoneValidation,
        addressValidation,
      }),
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error)
    }

    window.location.href = "/onboarding/success"
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          {t("accountInfo")}
        </CardTitle>
        <CardDescription>{t("createAccountDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")} *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")} *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">{t("businessName")} *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            placeholder={t("businessNamePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")} *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")} *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">{t("country")} *</Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryPhoneData).map(([code, data]) => (
                  <SelectItem key={code} value={code}>
                    {data.flag} {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">{t("currency")} *</Label>
            <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencies).map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    {currency.flag} {currency.name} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={() => setCurrentStep(2)} className="w-full">
          {t("continue")}
        </Button>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          {t("phoneVerification")}
        </CardTitle>
        <CardDescription>{t("phoneVerificationDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneNumber")} *</Label>
          <div className="flex space-x-2">
            <div className="w-24">
              <Input
                value={countryPhoneData[formData.country as keyof typeof countryPhoneData]?.callingCode}
                disabled
              />
            </div>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={t("phoneNumberPlaceholder")}
              required
            />
          </div>
        </div>

        {phoneValidation && !phoneValidation.isValid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{phoneValidation.errorMessage}</AlertDescription>
          </Alert>
        )}

        {!phoneVerified && (
          <Button onClick={validatePhone} disabled={!formData.phone}>
            <Phone className="h-4 w-4 mr-2" />
            {t("sendVerificationCode")}
          </Button>
        )}

        {verificationId && !phoneVerified && (
          <div className="space-y-2">
            <Label htmlFor="verificationCode">{t("verificationCode")} *</Label>
            <Input
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={t("enterVerificationCode")}
              maxLength={6}
            />
            <Button onClick={verifyPhoneCode} disabled={!verificationCode}>
              <Check className="h-4 w-4 mr-2" />
              {t("verifyCode")}
            </Button>
          </div>
        )}

        {phoneVerified && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription className="text-green-600">{t("phoneVerified")}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {t("addressVerification")}
        </CardTitle>
        <CardDescription>{t("addressVerificationDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">{t("streetAddress")} *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder={t("streetAddressPlaceholder")}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">{t("city")} *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">{t("state")} *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">{t("postalCode")} *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            required
          />
        </div>

        {addressValidation && !addressValidation.isValid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{addressValidation.errorMessage}</AlertDescription>
          </Alert>
        )}

        {addressValidation?.suggestions && (
          <div className="space-y-2">
            <Label>{t("suggestedAddresses")}</Label>
            {addressValidation.suggestions.map((suggestion: any, index: number) => (
              <div
                key={index}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  handleInputChange("address", suggestion.street)
                  handleInputChange("city", suggestion.city)
                  handleInputChange("state", suggestion.state)
                  handleInputChange("postalCode", suggestion.postalCode)
                  setAddressVerified(true)
                }}
              >
                {suggestion.fullAddress}
              </div>
            ))}
          </div>
        )}

        <Button onClick={validateAddress} disabled={!formData.address || !formData.city}>
          <MapPin className="h-4 w-4 mr-2" />
          {t("validateAddress")}
        </Button>

        {addressVerified && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription className="text-green-600">{t("addressVerified")}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          {t("paymentMethod")}
        </CardTitle>
        <CardDescription>{t("paymentMethodDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              {t("creditCard")}
            </TabsTrigger>
            <TabsTrigger value="crypto">
              <Wallet className="h-4 w-4 mr-2" />
              {t("cryptocurrency")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t("traditionalPayment")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("traditionalPaymentDescription")}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Visa</Badge>
                <Badge variant="outline">Mastercard</Badge>
                <Badge variant="outline">American Express</Badge>
                <Badge variant="outline">PayPal</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t("cryptoPayment")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("cryptoPaymentDescription")}</p>

              {!walletConnected ? (
                <Button onClick={connectWallet} variant="outline" className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  {t("connectWallet")}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <Wallet className="h-4 w-4" />
                    <AlertDescription className="text-green-600">
                      {t("walletConnected")}: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>{t("selectCryptocurrency")}</Label>
                    <RadioGroup value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      {Object.entries(currencies)
                        .filter(([_, currency]) => currency.crypto)
                        .map(([code, currency]) => (
                          <div key={code} className="flex items-center space-x-2">
                            <RadioGroupItem value={code} id={code} />
                            <Label htmlFor={code} className="flex items-center space-x-2">
                              <span>{currency.flag}</span>
                              <span>
                                {currency.name} ({currency.symbol})
                              </span>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">{t("orderSummary")}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("plan")}</span>
              <span className="font-medium">{pricingPlans.find((p) => p.id === selectedPlan)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("billingCycle")}</span>
              <span>{t(billingCycle)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("currency")}</span>
              <span>{currencies[formData.currency]?.name}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>{t("total")}</span>
                <span>
                  {CurrencyService.formatPrice(localizedPrice, formData.currency)}
                  {billingCycle === "annual" && (
                    <Badge variant="secondary" className="ml-2">
                      {t("save")} 17%
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              {t("acceptTerms")}{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                {t("termsOfService")}
              </a>{" "}
              {t("and")}{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                {t("privacyPolicy")}
              </a>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketingEmails"
              checked={formData.marketingEmails}
              onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
            />
            <Label htmlFor="marketingEmails" className="text-sm">
              {t("marketingEmails")}
            </Label>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={processPayment}
          disabled={!formData.acceptTerms || loading || (paymentMethod === "crypto" && !walletConnected)}
          className="w-full"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {paymentMethod === "crypto" ? (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              {t("payWithCrypto")}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              {t("completePayment")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const steps = [
    { id: 1, name: t("accountInfo"), icon: Globe },
    { id: 2, name: t("phoneVerification"), icon: Phone },
    { id: 3, name: t("addressVerification"), icon: MapPin },
    { id: 4, name: t("payment"), icon: paymentMethod === "crypto" ? Wallet : CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                      {step.name}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Steps */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation */}
        {currentStep > 1 && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={loading}>
              {t("back")}
            </Button>
            <div className="text-sm text-gray-500">
              {t("step")} {currentStep} {t("of")} {steps.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
