import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
