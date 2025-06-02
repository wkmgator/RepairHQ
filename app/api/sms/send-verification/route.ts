import { type NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your RepairHQ verification code is: ${verificationCode}. This code expires in 10 minutes.`,
      from: process.env.TWILIO_FROM_NUMBER!,
      to: phoneNumber,
    })

    // Store verification code in database with expiration
    // This is a simplified example - you should use a proper database
    const verificationId = message.sid

    // In production, store in Redis or database with expiration
    global.verificationCodes = global.verificationCodes || new Map()
    global.verificationCodes.set(verificationId, {
      code: verificationCode,
      phoneNumber,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    })

    return NextResponse.json({
      success: true,
      verificationId,
      message: "Verification code sent successfully",
    })
  } catch (error: any) {
    console.error("SMS verification error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
