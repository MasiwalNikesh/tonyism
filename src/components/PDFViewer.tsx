"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker to use fake worker (no external dependencies)
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((pdfjs) => {
    (pdfjs.GlobalWorkerOptions as any).workerSrc = false;
  });
}

interface PDFViewerProps {
  file: string;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("Error loading PDF:", error)}
        className="border shadow-lg"
        loading={<div className="p-4">Loading PDF...</div>}
      >
        <Page
          pageNumber={pageNumber}
          className="max-w-full"
          loading={<div className="p-4">Loading page...</div>}
        />
      </Document>

      {numPages && (
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(numPages, prev + 1))
            }
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
