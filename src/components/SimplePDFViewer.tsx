"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker on client side only - using a simplified approach
let workerConfigured = false;

const configureWorker = async () => {
  if (typeof window !== "undefined" && !workerConfigured) {
    try {
      // Configure PDF.js worker
      const { pdfjs } = await import("react-pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      workerConfigured = true;
    } catch (error) {
      console.error("Failed to configure PDF worker:", error);
    }
  }
};

interface SimplePDFViewerProps {
  file: string;
}

export default function SimplePDFViewer({ file }: SimplePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState<number>(0.5); // Default zoom set to 0.50
  const [showTOC, setShowTOC] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [animationDirection, setAnimationDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    configureWorker();

    // Check URL parameters for initial page
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const initialPage = urlParams.get("page");
      if (initialPage) {
        const pageNum = parseInt(initialPage);
        if (pageNum > 0) {
          setPageNumber(pageNum);
        }
      }
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      console.log("PDF loaded successfully with", numPages, "pages");
      setNumPages(numPages);
      setError("");
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    setError(`Failed to load PDF: ${error.message}`);
  }, []);

  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Page flip animation variants
  const pageVariants = {
    initial: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? -90 : 90,
      x: direction === "forward" ? -50 : 50,
      opacity: 0,
      transformOrigin: direction === "forward" ? "right" : "left",
      scale: 0.9,
    }),
    animate: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: "center",
    },
    exit: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? 90 : -90,
      x: direction === "forward" ? 50 : -50,
      opacity: 0,
      scale: 0.9,
      transformOrigin: direction === "forward" ? "left" : "right",
    }),
  };

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= numPages && !isAnimating) {
        const direction = page > pageNumber ? "forward" : "backward";
        setAnimationDirection(direction);
        setIsAnimating(true);

        // Delay page change to allow animation to start
        setTimeout(() => {
          setPageNumber(page);
        }, 100);
      }
    },
    [numPages, pageNumber, isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAnimating) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          goToPage(pageNumber - 1);
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Space bar
          e.preventDefault();
          goToPage(pageNumber + 1);
          break;
        case "Home":
          e.preventDefault();
          goToPage(1);
          break;
        case "End":
          e.preventDefault();
          goToPage(numPages);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [pageNumber, numPages, isAnimating, goToPage]);

  const getTOC = useCallback(() => {
    // Import chapters for context - using require for sync import in component
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { chapters } = require("@/lib/chapters");

    const tocItems: Array<{
      title: string;
      page: number;
      type: "chapter" | "story";
      chapterSlug?: string;
      author?: string;
      relationship?: string;
    }> = [];

    // Add chapter sections and their stories
    chapters.forEach((chapter: { slug: string; title: string; order: number; magazinePages?: { startPage: number; stories?: Array<{ title: string; page: number; author: string; relationship: string }> } }) => {
      // Add chapter header
      tocItems.push({
        title: `${chapter.order}. ${chapter.title}`,
        page: chapter.magazinePages?.startPage || 1,
        type: "chapter",
        chapterSlug: chapter.slug,
      });

      // Add individual stories from the chapter
      if (chapter.magazinePages?.stories) {
        chapter.magazinePages.stories.forEach((story: { title: string; page: number; author: string; relationship: string }) => {
          tocItems.push({
            title: story.title,
            page: story.page,
            type: "story",
            author: story.author,
            relationship: story.relationship,
            chapterSlug: chapter.slug,
          });
        });
      }
    });

    return tocItems;
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error Loading PDF</div>
          <div className="text-sm text-gray-600">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-black">
                Table of Contents
              </h3>
              <button
                onClick={() => setShowTOC(false)}
                className="text-gray-500 hover:text-black text-xl transition-colors p-1"
                title="Hide Table of Contents"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {getTOC().map((item, index) => (
                <div key={index} className="relative">
                  {item.type === "chapter" ? (
                    // Chapter Header
                    <div className="mb-3 mt-6 first:mt-0">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg border-l-4 border-amber-500">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.title.split(".")[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-amber-800 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <div className="text-xs text-amber-600 mt-1">
                            Pages {item.page}+ •
                            <a
                              href={`/chapters/${item.chapterSlug}`}
                              className="ml-1 underline hover:text-amber-800"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Chapter
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Individual Story
                    <button
                      onClick={() => {
                        if (!isAnimating) goToPage(item.page);
                      }}
                      className={`block w-full text-left p-3 ml-4 rounded text-sm hover:bg-blue-50 transition-colors border-l-2 ${
                        pageNumber === item.page
                          ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium text-black leading-tight text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                        <span>by {item.author}</span>
                        {item.relationship && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {item.relationship}
                          </span>
                        )}
                        <span className="ml-auto font-medium">
                          Page {item.page}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left Side Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowTOC(!showTOC)}
                className="px-4 py-2 text-sm text-black bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {showTOC ? "Hide" : "Show"} Contents
              </button>

              {/* Page Navigation */}
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded">
                <button
                  onClick={() => goToPage(pageNumber - 1)}
                  disabled={pageNumber <= 1 || isAnimating}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                >
                  ←
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-black font-medium">Page:</span>
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page && !isAnimating) goToPage(page);
                    }}
                    className="w-16 px-2 py-1 text-sm text-black border rounded text-center"
                  />
                  <span className="text-sm text-black">of {numPages}</span>
                </div>

                <button
                  onClick={() => goToPage(pageNumber + 1)}
                  disabled={pageNumber >= numPages || isAnimating}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm text-black font-medium">Zoom:</span>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="px-3 py-1 text-sm text-black border rounded bg-white"
                >
                  <option value={0.5}>50%</option>
                  <option value={0.75}>75%</option>
                  <option value={1}>100%</option>
                  <option value={1.25}>125%</option>
                  <option value={1.5}>150%</option>
                  <option value={2}>200%</option>
                </select>
              </div>

              <a
                href="/chapters"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors"
              >
                📖 Read Book
              </a>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 relative">
          {/* Animation indicator */}
          {isAnimating && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Turning page...
            </div>
          )}

          <div className="flex justify-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <div>Loading PDF...</div>
                </div>
              }
              error={
                <div className="p-8 text-center text-red-500">
                  <div>Failed to load PDF</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Retry
                  </button>
                </div>
              }
            >
              {numPages > 0 && (
                <div className="relative" style={{ perspective: "1000px" }}>
                  <AnimatePresence mode="wait" custom={animationDirection}>
                    <motion.div
                      key={pageNumber}
                      custom={animationDirection}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      onAnimationComplete={onAnimationComplete}
                      className="relative"
                    >
                      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                        {/* Page flip shadow effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 z-10"
                          animate={{
                            opacity: isAnimating ? [0, 0.3, 0] : 0,
                            x: isAnimating
                              ? animationDirection === "forward"
                                ? [-100, 0, 100]
                                : [100, 0, -100]
                              : 0,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                          }}
                        />

                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          loading={
                            <div className="p-8 text-center">
                              <div className="animate-pulse bg-gray-200 h-96 w-full rounded"></div>
                              <div className="mt-4">
                                Loading page {pageNumber}...
                              </div>
                            </div>
                          }
                          error={
                            <div className="p-8 text-center text-red-500">
                              Failed to load page {pageNumber}
                            </div>
                          }
                          className="max-w-full relative z-0"
                        />

                        {/* Book binding shadow */}
                        <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-gray-300 to-transparent opacity-30 pointer-events-none" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
