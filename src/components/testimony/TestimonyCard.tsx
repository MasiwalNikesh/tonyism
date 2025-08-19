"use client";

import { motion } from "framer-motion";
import { Heart, User, Tag, Calendar, ArrowRight } from "lucide-react";
import { Testimony, highlightMatches, truncateContent } from "@/lib/search";
import { getTestimonyImageSources } from "@/lib/images";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface TestimonyCardProps {
  testimony: Testimony;
  matches?: Array<{ title: number; content: number; author: number; relationship: number }>;
  index?: number;
  variant?: "default" | "compact" | "featured";
  showImage?: boolean;
}

const categoryColors = {
  family: "bg-rose-100 text-rose-800 border-rose-200",
  elders: "bg-amber-100 text-amber-800 border-amber-200", 
  friends: "bg-blue-100 text-blue-800 border-blue-200",
  colleagues: "bg-green-100 text-green-800 border-green-200",
};

const categoryIcons = {
  family: "❤️",
  elders: "👴",
  friends: "🤝",
  colleagues: "💼",
};

export default function TestimonyCard({
  testimony,
  matches,
  index = 0,
  variant = "default",
  showImage = true,
}: TestimonyCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const highlightedTitle = highlightMatches(testimony.title, matches);
  const highlightedContent = highlightMatches(
    truncateContent(testimony.content, isCompact ? 120 : 200),
    matches
  );

  const { profileImage } = getTestimonyImageSources(testimony);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-white rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300",
        "cursor-pointer overflow-hidden",
        isFeatured && "lg:col-span-2",
        categoryColors[testimony.category]
      )}
    >
      <Link 
        href={`/testimonies/${testimony.id}`}
        onClick={() => {
          // Save current scroll position before navigating to detail page
          sessionStorage.setItem('testimonies-scroll-position', window.scrollY.toString());
          // Mark that we're navigating to a detail page
          sessionStorage.setItem('navigated-to-detail', 'true');
        }}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcons[testimony.category]}</span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    categoryColors[testimony.category]
                  )}
                >
                  {testimony.category}
                </span>
              </div>
              
              <h3
                className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} />
                <span className="font-medium">{testimony.author}</span>
                <span className="text-gray-400">•</span>
                <span className="italic">{testimony.relationship}</span>
              </div>
            </div>

            {showImage && (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden ml-4 flex-shrink-0 shadow-lg border-2 border-white">
                <Image
                  src={profileImage}
                  alt={`${testimony.author} profile`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div
            className={cn(
              "text-gray-700 leading-relaxed mb-4",
              isCompact ? "text-sm line-clamp-3" : "text-base line-clamp-4"
            )}
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />

          {/* Tags */}
          {!isCompact && testimony.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {testimony.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              {testimony.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{testimony.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Page {testimony.page}</span>
              <Heart size={14} className="text-red-400" />
            </div>
            
            <motion.div
              className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"
              whileHover={{ x: 4 }}
            >
              <span>Read more</span>
              <ArrowRight size={14} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}