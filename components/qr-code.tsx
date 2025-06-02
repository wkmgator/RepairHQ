"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"

interface QRCodeProps {
  value: string
  size?: number
  color?: string
  backgroundColor?: string
}

export function QRCode({ value, size = 200, color = "#000000", backgroundColor = "#ffffff" }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: value,
      dotsOptions: {
        color: color,
        type: "rounded",
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      cornersDotOptions: {
        type: "dot",
      },
    })

    // Clear previous QR code
    if (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild)
    }

    qrCode.append(ref.current)
  }, [value, size, color, backgroundColor])

  return <div ref={ref} />
}
