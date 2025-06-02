import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { verificationId, code } = await request.json()

    if (!verificationId || !code) {
      return NextResponse.json({ error: "Verification ID and code are required" }, { status: 400 })
    }

    // Retrieve stored verification data
    global.verificationCodes = global.verificationCodes || new Map()
    const storedData = global.verificationCodes.get(verificationId)

    if (!storedData) {
      return NextResponse.json({ error: "Invalid verification ID" }, { status: 400 })
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      global.verificationCodes.delete(verificationId)
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Code is valid - remove from storage
    global.verificationCodes.delete(verificationId)

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error: any) {
    console.error("Code verification error:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}
