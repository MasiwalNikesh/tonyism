"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { chapters } from "@/lib/chapters";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  currentChapter?: string;
}

export default function TableOfContents({
  currentChapter,
}: TableOfContentsProps) {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-800 mb-4">
            Table of Contents
          </h1>
          <p className="text-lg text-amber-700 font-serif italic">
            Navigate through the chapters of Tony&apos;s life
          </p>
        </motion.div>

        {/* Book-like Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl border-4 border-amber-200 overflow-hidden"
        >
          {/* Book Spine Effect */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-inner" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {chapters.map((chapter, index) => {
                const isActive = currentChapter === chapter.slug;
                const isHovered = hoveredChapter === chapter.slug;

                return (
                  <motion.div
                    key={chapter.id}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredChapter(chapter.slug)}
                    onHoverEnd={() => setHoveredChapter(null)}
                    className="relative"
                  >
                    <Link href={`/chapters/${chapter.slug}`}>
                      <motion.div
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300",
                          "hover:shadow-lg hover:scale-[1.02]",
                          isActive
                            ? "border-amber-500 bg-amber-50 shadow-md"
                            : "border-amber-200 hover:border-amber-400 bg-white"
                        )}
                        whileHover={{ x: 5 }}
                      >
                        {/* Chapter Number */}
                        <motion.div
                          className="flex items-center space-x-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-lg",
                              isActive
                                ? "bg-amber-500 text-white"
                                : "bg-amber-100 text-amber-700"
                            )}
                          >
                            {chapter.order}
                          </div>

                          {/* Chapter Info */}
                          <div className="flex-1">
                            <h3
                              className={cn(
                                "text-lg md:text-xl font-serif font-semibold mb-1",
                                isActive ? "text-amber-800" : "text-gray-800"
                              )}
                            >
                              {chapter.title}
                            </h3>
                            <p
                              className={cn(
                                "text-sm md:text-base",
                                isActive ? "text-amber-600" : "text-gray-600"
                              )}
                            >
                              {chapter.description}
                            </p>
                          </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                          className="flex items-center space-x-3"
                          animate={{
                            x: isHovered ? 5 : 0,
                            opacity: isHovered ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {chapter.magazinePages && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`/magazine?page=${chapter.magazinePages?.startPage}`, '_blank');
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              📰 Magazine
                            </button>
                          )}
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500 font-serif">
                              Chapter
                            </span>
                            <motion.span
                              className={cn(
                                "text-lg font-serif font-bold",
                                isActive ? "text-amber-600" : "text-gray-700"
                              )}
                              animate={{
                                scale: isHovered ? 1.1 : 1,
                                color: isHovered ? "#d97706" : undefined,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {String(chapter.order).padStart(2, "0")}
                            </motion.span>
                          </div>
                        </motion.div>

                        {/* Progress Indicator */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-amber-300"
                          initial={{ width: 0 }}
                          animate={{
                            width: isActive ? "100%" : isHovered ? "50%" : "0%",
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 pt-8 border-t-2 border-amber-200 text-center"
            >
              <p className="text-amber-700 font-serif italic">
                &ldquo;The greatest legacy one can pass on to one&apos;s
                children and grandchildren is not money or other material things
                accumulated in one&apos;s life, but rather a legacy of character
                and faith.&rdquo;
              </p>
              <p className="text-sm text-amber-600 mt-2 font-serif">
                — Tony Batra
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-amber-600 text-white font-serif rounded-lg shadow-lg hover:bg-amber-700 transition-colors"
            >
              Chat with Tony&apos;s Wisdom
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
