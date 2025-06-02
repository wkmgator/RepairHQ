"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download, Printer, ZoomIn, ZoomOut } from "lucide-react"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  file: string | File | Blob
  onPrint?: () => void
  onDownload?: () => void
  className?: string
}

export function PDFViewer({ file, onPrint, onDownload, className = "" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset
      return Math.min(Math.max(1, newPageNumber), numPages || 1)
    })
  }

  const changeZoom = (delta: number) => {
    setScale((prevScale) => Math.min(Math.max(0.5, prevScale + delta), 2.0))
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || "..."}
          </span>
          <Button variant="outline" size="icon" onClick={() => changePage(1)} disabled={pageNumber >= (numPages || 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeZoom(-0.1)} disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={() => changeZoom(0.1)} disabled={scale >= 2.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-auto max-h-[600px] border rounded-lg bg-gray-50 flex justify-center">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }
          error={<div className="text-red-600 p-8">Failed to load PDF. Please try again.</div>}
        >
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} />
        </Document>
      </div>
    </Card>
  )
}
