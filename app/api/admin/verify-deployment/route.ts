import { type NextRequest, NextResponse } from "next/server"
import { verifyDeployment, generateVerificationReport } from "@/lib/deployment-verification"

export async function GET(request: NextRequest) {
  // This should only be accessible to admins in production
  // Add authentication check here

  try {
    const results = await verifyDeployment()

    // Check if we should generate a report
    const format = request.nextUrl.searchParams.get("format")

    if (format === "report") {
      const report = await generateVerificationReport()
      return new NextResponse(report, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": 'attachment; filename="deployment-verification-report.md"',
        },
      })
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        success: results.filter((r) => r.status === "success").length,
        warning: results.filter((r) => r.status === "warning").length,
        error: results.filter((r) => r.status === "error").length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
