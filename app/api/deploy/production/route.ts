import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (in production, use proper auth)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.DEPLOY_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deploymentId = `dpl_${Math.random().toString(36).substr(2, 9)}`

    // Log deployment start
    console.log(`🚀 Starting production deployment: ${deploymentId}`)

    // Run deployment script
    const { stdout, stderr } = await execAsync("./scripts/deploy-production.sh")

    if (stderr && !stderr.includes("warning")) {
      throw new Error(stderr)
    }

    // Parse deployment URL from Vercel output
    const deploymentUrl = stdout.match(/https:\/\/[^\s]+/)?.[0] || "https://repairhq.io"

    return NextResponse.json({
      success: true,
      deploymentId,
      deploymentUrl,
      output: stdout,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Deployment failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    environment: "production",
    timestamp: new Date().toISOString(),
  })
}
