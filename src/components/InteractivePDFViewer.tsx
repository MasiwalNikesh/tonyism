"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { pdfjs } from "react-pdf";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker
if (typeof window !== "undefined") {
  import("react-pdf/dist/Page/AnnotationLayer.css");
  import("react-pdf/dist/Page/TextLayer.css");

  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
}

interface TOCItem {
  title: string;
  page: number;
  level: number;
}

interface InteractivePDFViewerProps {
  file: string;
}

export default function InteractivePDFViewer({
  file,
}: InteractivePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(0.5); // Default zoom set to 0.50
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    Array<{ page: number; text: string }>
  >([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showTOC, setShowTOC] = useState<boolean>(false);
  const [toc, setTOC] = useState<TOCItem[]>([]);
  const [pageTexts, setPageTexts] = useState<Map<number, string>>(new Map());
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDocumentLoadSuccess = useCallback(
    async ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);

      // Extract table of contents from PDF metadata
      try {
        const pdf = await pdfjs.getDocument(file).promise;
        setPdfDocument(pdf);

        // Try to extract outline (bookmarks) for TOC
        const outline = await pdf.getOutline();
        if (outline) {
          const tocItems: TOCItem[] = [];
          const processOutlineItem = (
            item: pdfjs.PDFDocumentOutline,
            level: number = 0
          ) => {
            if (item.dest) {
              // Extract page number from destination
              let pageNum = 1;
              if (
                Array.isArray(item.dest) &&
                item.dest[0] &&
                typeof item.dest[0] === "object" &&
                "num" in item.dest[0]
              ) {
                pageNum = (item.dest[0] as { num: number }).num || 1;
              }
              tocItems.push({
                title: item.title || "Untitled",
                page: pageNum,
                level,
              });
            }

            if (item.items && item.items.length > 0) {
              item.items.forEach((subItem: pdfjs.PDFDocumentOutline) =>
                processOutlineItem(subItem, level + 1)
              );
            }
          };

          outline.forEach((item: pdfjs.PDFDocumentOutline) =>
            processOutlineItem(item)
          );
          setTOC(tocItems);
        } else {
          // Generate a basic TOC based on page numbers if no outline exists
          const basicTOC: TOCItem[] = [];
          for (let i = 1; i <= numPages; i++) {
            basicTOC.push({
              title: `Page ${i}`,
              page: i,
              level: 0,
            });
          }
          setTOC(basicTOC);
        }
      } catch (error) {
        console.error("Error extracting TOC:", error);
        // Fallback TOC
        const fallbackTOC: TOCItem[] = [];
        for (let i = 1; i <= numPages; i++) {
          fallbackTOC.push({
            title: `Page ${i}`,
            page: i,
            level: 0,
          });
        }
        setTOC(fallbackTOC);
      }
    },
    [file]
  );

  const extractTextFromPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocument || pageTexts.has(pageNum)) return;

      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item: { str: string }) => item.str)
          .join(" ");

        setPageTexts((prev) => new Map(prev.set(pageNum, text)));
      } catch (error) {
        console.error(`Error extracting text from page ${pageNum}:`, error);
      }
    },
    [pdfDocument, pageTexts]
  );

  const performSearch = useCallback(async () => {
    if (!searchText.trim() || !pdfDocument) return;

    setIsSearching(true);
    setSearchResults([]);
    setCurrentSearchIndex(-1);

    const results: Array<{ page: number; text: string }> = [];

    // Extract text from all pages for search
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (!pageTexts.has(pageNum)) {
        await extractTextFromPage(pageNum);
      }

      const pageText = pageTexts.get(pageNum) || "";
      const lowerSearchText = searchText.toLowerCase();
      const lowerPageText = pageText.toLowerCase();

      if (lowerPageText.includes(lowerSearchText)) {
        // Find the context around the search term
        const index = lowerPageText.indexOf(lowerSearchText);
        const start = Math.max(0, index - 50);
        const end = Math.min(pageText.length, index + searchText.length + 50);
        const context = pageText.substring(start, end);

        results.push({
          page: pageNum,
          text: context,
        });
      }
    }

    setSearchResults(results);
    setIsSearching(false);

    if (results.length > 0) {
      setCurrentSearchIndex(0);
      setPageNumber(results[0].page);
    }
  }, [searchText, pdfDocument, numPages, pageTexts, extractTextFromPage]);

  const navigateToSearchResult = useCallback(
    (index: number) => {
      if (index >= 0 && index < searchResults.length) {
        setCurrentSearchIndex(index);
        setPageNumber(searchResults[index].page);
      }
    },
    [searchResults]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);
        setShowTOC(false);
      }
    },
    [numPages]
  );

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading interactive PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          showTOC ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
      >
        {showTOC && (
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Table of Contents</h3>
              <button
                onClick={() => setShowTOC(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              {toc.map((item, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(item.page)}
                  className={`block w-full text-left p-2 rounded text-sm hover:bg-blue-50 ${
                    item.level > 0 ? `ml-${item.level * 4}` : ""
                  } ${pageNumber === item.page ? "bg-blue-100" : ""}`}
                >
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="text-xs text-gray-500">Page {item.page}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTOC(!showTOC)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                {showTOC ? "Hide" : "Show"} TOC
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm">Page:</span>
                <input
                  type="number"
                  min="1"
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page) goToPage(page);
                  }}
                  className="w-16 px-2 py-1 text-sm border rounded"
                />
                <span className="text-sm text-gray-500">of {numPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  ←
                </button>
                <button
                  onClick={() => goToPage(pageNumber + 1)}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  →
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in PDF..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && performSearch()}
                  className="w-64 px-3 py-2 text-sm border rounded-lg pr-10"
                />
                <button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {isSearching ? "..." : "🔍"}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </span>
                  <button
                    onClick={() =>
                      navigateToSearchResult(currentSearchIndex - 1)
                    }
                    disabled={currentSearchIndex <= 0}
                    className="px-2 py-1 text-sm bg-gray-100 rounded disabled:bg-gray-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() =>
                      navigateToSearchResult(currentSearchIndex + 1)
                    }
                    disabled={currentSearchIndex >= searchResults.length - 1}
                    className="px-2 py-1 text-sm bg-gray-100 rounded disabled:bg-gray-50"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Zoom:</span>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="px-2 py-1 text-sm border rounded"
              >
                <option value={0.5}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1}>100%</option>
                <option value={1.2}>120%</option>
                <option value={1.5}>150%</option>
                <option value={2}>200%</option>
              </select>
            </div>
          </div>

          {/* Search Results Bar */}
          {searchResults.length > 0 && currentSearchIndex >= 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm">
                <strong>
                  Found on page {searchResults[currentSearchIndex].page}:
                </strong>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                ...{searchResults[currentSearchIndex].text}...
              </div>
            </div>
          )}
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error("Error loading PDF:", error)
              }
              loading={<div className="p-8 text-center">Loading PDF...</div>}
              options={{
                cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
                cMapPacked: true,
              }}
            >
              <div className="bg-white shadow-lg">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={
                    <div className="p-8 text-center">Loading page...</div>
                  }
                  onLoadSuccess={() => extractTextFromPage(pageNumber)}
                  className="max-w-full"
                />
              </div>
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
