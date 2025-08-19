"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageTurnerProps {
  children: React.ReactNode;
  direction?: "forward" | "backward";
  onAnimationComplete?: () => void;
  className?: string;
}

export default function PageTurner({
  children,
  direction = "forward",
  onAnimationComplete,
  className,
}: PageTurnerProps) {
  const pageVariants = {
    initial: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? 0 : -180,
      x: direction === "forward" ? 0 : -20,
      opacity: 1,
      transformOrigin: direction === "forward" ? "left" : "right",
    }),
    animate: {
      rotateY: 0,
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? 180 : -180,
      x: direction === "forward" ? 20 : -20,
      opacity: 0,
      transformOrigin: direction === "forward" ? "right" : "left",
    }),
  };

  const pageTurnVariants = {
    initial: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? 0 : 0,
      x: 0,
      opacity: 0,
      transformOrigin: direction === "forward" ? "left" : "right",
    }),
    animate: {
      rotateY: direction === "forward" ? 90 : -90,
      x: direction === "forward" ? 10 : -10,
      opacity: 1,
    },
    exit: {
      rotateY: direction === "forward" ? 180 : -180,
      x: direction === "forward" ? 20 : -20,
      opacity: 0,
    },
  };

  return (
    <div className={cn("relative perspective-1000", className)}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={direction}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
          className={cn(
            "relative w-full h-full",
            "bg-gradient-to-br from-amber-50 to-orange-50",
            "border border-amber-200 rounded-lg shadow-lg",
            "before:absolute before:inset-0",
            'before:bg-[url(\'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23fbbf24" fill-opacity="0.05"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]',
            "before:rounded-lg"
          )}
        >
          {/* Page Content */}
          <div className="relative z-10 p-6 md:p-8">{children}</div>

          {/* Page Turn Effect */}
          <motion.div
            custom={direction}
            variants={pageTurnVariants}
            className={cn(
              "absolute top-0 h-full w-1/2",
              "bg-gradient-to-r from-amber-100 to-amber-200",
              "shadow-lg",
              direction === "forward"
                ? "right-0 origin-right"
                : "left-0 origin-left",
              "before:absolute before:inset-0",
              'before:bg-[url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f59e0b" fill-opacity="0.1"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
            )}
          />

          {/* Page Shadow */}
          <motion.div
            className={cn(
              "absolute top-0 h-full w-1",
              "bg-gradient-to-b from-gray-400 to-transparent",
              direction === "forward" ? "right-0" : "left-0"
            )}
            animate={{
              opacity: [0, 0.3, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Book Spine Shadow */}
      <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-gray-600 to-gray-400 transform -translate-x-1/2 shadow-inner" />
    </div>
  );
}

// Navigation Controls Component
interface PageNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  totalPages: number;
}

export function PageNavigation({
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  currentPage,
  totalPages,
}: PageNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-lg shadow-md border border-amber-200">
      {/* Previous Button */}
      <motion.button
        onClick={onPrevious}
        disabled={!hasPrevious}
        whileHover={hasPrevious ? { scale: 1.05 } : {}}
        whileTap={hasPrevious ? { scale: 0.95 } : {}}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg font-serif",
          "transition-all duration-200",
          hasPrevious
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Previous</span>
      </motion.button>

      {/* Page Indicator */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 font-serif">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i === currentPage - 1 ? "bg-amber-500" : "bg-gray-300"
              )}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={!hasNext}
        whileHover={hasNext ? { scale: 1.05 } : {}}
        whileTap={hasNext ? { scale: 0.95 } : {}}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg font-serif",
          "transition-all duration-200",
          hasNext
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        )}
      >
        <span>Next</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>
    </div>
  );
}
