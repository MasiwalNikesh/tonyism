"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BookCoverProps {
  onOpenBook: () => void;
}

export default function BookCover({ onOpenBook }: BookCoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 relative">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        {/* Book Cover Container */}
        <motion.div
          className={cn(
            "relative aspect-[3/4] bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900",
            "rounded-lg shadow-2xl border-4 border-amber-600",
            "transform perspective-1000",
            'before:absolute before:inset-0 before:bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d97706" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]',
            "before:rounded-lg before:opacity-20"
          )}
          whileHover={{
            scale: 1.02,
            rotateY: 5,
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Spine Effect */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-amber-600 to-amber-800 transform -translate-x-1/2 shadow-inner" />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-6 text-center">
            {/* Decorative Border */}
            <div className="absolute inset-4 border-2 border-amber-400 rounded opacity-30" />

            {/* Tony's Logo - Top Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="flex-shrink-0 mt-4"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl border-4 border-amber-300">
                <Image
                  src="/images/logo/TONYism_logo.png"
                  alt="Tony Batra"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Central Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 mb-4"
              >
                Tonyism
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-lg md:text-xl lg:text-2xl font-serif text-amber-200 mb-6 italic"
              >
                Babu Moshai... zindagi badi honi chahiye, lambi nahin!
              </motion.p>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="text-base md:text-lg lg:text-xl font-serif text-amber-300"
              >
                <p className="mb-2">In Memory of</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-200 mb-2">
                  Tony Batra
                </p>
                <p className="text-sm md:text-base text-amber-400 mb-2">(Shri Gajendar Kumar Batra)</p>
                <p className="text-xs md:text-sm text-amber-400">1959 - 2025</p>
              </motion.div>
            </div>

            {/* Bottom Section - Decorative Elements and Button */}
            <div className="flex-shrink-0 flex flex-col items-center mb-4">
              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex space-x-4 mb-6"
              >
                <div className="w-2 h-2 bg-amber-300 rounded-full" />
                <div className="w-2 h-2 bg-amber-300 rounded-full" />
                <div className="w-2 h-2 bg-amber-300 rounded-full" />
              </motion.div>

              {/* Open Book Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(217, 119, 6, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenBook}
                className={cn(
                  "relative z-20 cursor-pointer",
                  "px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700",
                  "text-white font-serif text-base md:text-lg font-semibold",
                  "rounded-lg shadow-lg border-2 border-amber-500",
                  "transform transition-all duration-300",
                  "hover:from-amber-500 hover:to-amber-600",
                  "focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50",
                  "active:scale-95"
                )}
                style={{ pointerEvents: 'auto' }}
              >
                {isHovered ? "Open Book" : "Begin Reading"}
              </motion.button>
            </div>
          </div>

          {/* Page Turn Effect */}
          <motion.div
            className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-amber-600 to-transparent opacity-0"
            animate={{
              opacity: isHovered ? 0.3 : 0,
              x: isHovered ? -4 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Floating Particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
