"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { FixedSizeList as List } from "react-window";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

if (typeof window !== "undefined") {
  import("pdfjs-dist").then((pdfjs) => {
    (pdfjs.GlobalWorkerOptions as any).workerSrc = false;
  });
}

interface VirtualizedPDFViewerProps {
  file: string;
}

interface PageItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    numPages: number;
    scale: number;
    pageCache: Map<number, boolean>;
    setPageCache: React.Dispatch<React.SetStateAction<Map<number, boolean>>>;
  };
}

const ITEM_HEIGHT = 800;
const CACHE_SIZE = 10;

function PageItem({ index, style, data }: PageItemProps) {
  const pageNumber = index + 1;
  const { scale, setPageCache } = data;

  const handlePageLoadSuccess = useCallback(() => {
    setPageCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(pageNumber, true);

      if (newCache.size > CACHE_SIZE) {
        const firstKey = newCache.keys().next().value;
        if (firstKey !== undefined) {
          newCache.delete(firstKey);
        }
      }

      return newCache;
    });
  }, [pageNumber, setPageCache]);

  return (
    <div style={style} className="flex justify-center items-center">
      <div className="border shadow-lg bg-white">
        <Page
          pageNumber={pageNumber}
          scale={scale}
          onLoadSuccess={handlePageLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-96 w-96 bg-gray-100">
              <div className="text-sm text-gray-500">
                Loading page {pageNumber}...
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-96 w-96 bg-red-50">
              <div className="text-sm text-red-500">
                Failed to load page {pageNumber}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default function VirtualizedPDFViewer({
  file,
}: VirtualizedPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [pageCache, setPageCache] = useState<Map<number, boolean>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<List>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      console.log(`PDF loaded successfully with ${numPages} pages`);
      setNumPages(numPages);
      setIsLoading(false);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    setIsLoading(false);
  }, []);

  const handleScaleChange = useCallback((newScale: number) => {
    setScale(newScale);
    setPageCache(new Map());
  }, []);

  const scrollToPage = useCallback(
    (pageNumber: number) => {
      if (listRef.current && pageNumber >= 1 && pageNumber <= numPages) {
        listRef.current.scrollToItem(pageNumber - 1, "start");
        setCurrentPage(pageNumber);
      }
    },
    [numPages]
  );

  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      const page = Math.floor(scrollOffset / ITEM_HEIGHT) + 1;
      setCurrentPage(Math.max(1, Math.min(page, numPages)));
    },
    [numPages]
  );

  const itemData = useMemo(
    () => ({
      numPages,
      scale,
      pageCache,
      setPageCache,
    }),
    [numPages, scale, pageCache]
  );

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  console.log("VirtualizedPDFViewer render:", {
    isClient,
    numPages,
    isLoading,
    file,
  });

  return (
    <div className="flex flex-col h-screen">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-lg font-medium">Loading 485MB PDF...</div>
            <div className="text-sm text-gray-500">This may take a moment</div>
          </div>
        </div>
      )}

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="p-4 text-center">Initializing PDF...</div>}
      >
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {isLoading ? "Loading..." : `Page ${currentPage} of ${numPages}`}
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="page-input" className="text-sm">
                Go to page:
              </label>
              <input
                id="page-input"
                type="number"
                min="1"
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page) scrollToPage(page);
                }}
                className="w-20 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Scale:</span>
            <select
              value={scale}
              onChange={(e) => handleScaleChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border rounded"
            >
              <option value={0.5}>50%</option>
              <option value={0.75}>75%</option>
              <option value={1}>100%</option>
              <option value={1.25}>125%</option>
              <option value={1.5}>150%</option>
              <option value={2}>200%</option>
            </select>
          </div>
        </div>

        {numPages > 0 && (
          <List
            ref={listRef}
            height={window.innerHeight - 120}
            width="100%"
            itemCount={numPages}
            itemSize={ITEM_HEIGHT * scale}
            itemData={itemData}
            onScroll={handleScroll}
            overscanCount={2}
          >
            {PageItem}
          </List>
        )}
      </Document>
    </div>
  );
}
