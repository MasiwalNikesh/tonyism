"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getChapterBySlug,
  getNextChapter,
  getPreviousChapter,
} from "@/lib/chapters";
import { cn } from "@/lib/utils";
import ImageModal from "@/components/ImageModal";

interface ChapterPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = use(params);
  const chapter = getChapterBySlug(slug);

  // Modal state
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!chapter) {
    notFound();
  }

  const nextChapter = getNextChapter(slug);
  const previousChapter = getPreviousChapter(slug);

  // Collect all images from stories for modal navigation
  const allStoryImages: Array<{src: string; alt: string; caption?: string}> = [];
  if (chapter.stories) {
    chapter.stories.forEach(story => {
      if (story.images) {
        story.images.forEach((imageSrc, index) => {
          allStoryImages.push({
            src: imageSrc,
            alt: `${story.title} - Photo ${index + 1}`,
            caption: `From ${story.title} by ${story.author}`
          });
        });
      }
    });
  }

  // Handle image click
  const handleImageClick = (imageSrc: string, imageAlt: string, storyTitle: string, author: string) => {
    const imageIndex = allStoryImages.findIndex(img => img.src === imageSrc);
    setCurrentImageIndex(Math.max(0, imageIndex));
    setModalImage({
      src: imageSrc,
      alt: imageAlt,
      caption: `From ${storyTitle} by ${author}`
    });
  };

  // Handle modal navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    let newIndex = currentImageIndex;
    if (direction === 'prev' && currentImageIndex > 0) {
      newIndex = currentImageIndex - 1;
    } else if (direction === 'next' && currentImageIndex < allStoryImages.length - 1) {
      newIndex = currentImageIndex + 1;
    }
    
    setCurrentImageIndex(newIndex);
    setModalImage(allStoryImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link href="/chapters" className="inline-block mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-colors"
            >
              ← Back to Table of Contents
            </motion.button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-800 mb-2">
            Chapter {chapter.order}: {chapter.title}
          </h1>
          <p className="text-lg text-amber-700 font-serif italic">
            {chapter.description}
          </p>
        </motion.div>

        {/* Chapter Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl border-4 border-amber-200 overflow-hidden"
        >
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            {/* Main Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed"
            >
              {chapter.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-6 text-lg">
                  {paragraph.trim()}
                </p>
              ))}
            </motion.div>

            {/* Individual Stories */}
            {chapter.stories && chapter.stories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-12 space-y-12"
              >
                {chapter.stories.map((story, index) => (
                  <div key={story.id} className="border-l-4 border-amber-400 pl-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                    >
                      <h3 className="text-2xl font-serif font-bold text-amber-800 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-lg text-amber-600 font-semibold mb-1">
                        By {story.author}
                      </p>
                      <p className="text-sm text-amber-500 mb-6 italic">
                        {story.relationship}
                        {story.page && ` • Page ${story.page}`}
                      </p>
                      <div className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed">
                        {story.content.split("\n\n").map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4">
                            {paragraph.trim()}
                          </p>
                        ))}
                      </div>

                      {/* Story Images */}
                      {story.images && story.images.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                          className="mt-8"
                        >
                          <h4 className="text-lg font-serif font-semibold text-amber-700 mb-4">
                            Photo Gallery
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {story.images.map((imageSrc, imgIndex) => (
                              <motion.div
                                key={imgIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 + index * 0.1 + imgIndex * 0.1, duration: 0.5 }}
                                className="relative group cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleImageClick(imageSrc, `${story.title} - Photo ${imgIndex + 1}`, story.title, story.author)}
                              >
                                <div className="relative overflow-hidden rounded-lg shadow-lg border border-amber-200">
                                  <Image
                                    src={imageSrc}
                                    alt={`${story.title} - Photo ${imgIndex + 1}`}
                                    width={400}
                                    height={300}
                                    className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quotes Section */}
            {chapter.quotes && chapter.quotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-12 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-400"
              >
                <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">
                  Wisdom from Tony
                </h3>
                {chapter.quotes.map((quote) => (
                  <blockquote key={quote.id} className="mb-4">
                    <p className="text-lg italic text-amber-700 mb-2">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                    {quote.author && (
                      <cite className="text-sm text-amber-600">
                        — {quote.author}
                        {quote.context && (
                          <span className="text-amber-500 ml-2">
                            ({quote.context})
                          </span>
                        )}
                      </cite>
                    )}
                  </blockquote>
                ))}
              </motion.div>
            )}

            {/* Timeline Section */}
            {chapter.timeline && chapter.timeline.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-12"
              >
                <h3 className="text-xl font-serif font-semibold text-amber-800 mb-6">
                  Timeline
                </h3>
                <div className="space-y-4">
                  {chapter.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center font-serif font-bold text-white text-sm",
                          event.category === "personal" && "bg-blue-500",
                          event.category === "professional" && "bg-green-500",
                          event.category === "family" && "bg-purple-500",
                          event.category === "legacy" && "bg-amber-500"
                        )}
                      >
                        {event.year}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif font-semibold text-gray-800 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-between items-center mt-8"
        >
          {/* Previous Chapter */}
          {previousChapter ? (
            <Link href={`/chapters/${previousChapter.slug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-colors"
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
                <span>Previous: {previousChapter.title}</span>
              </motion.button>
            </Link>
          ) : (
            <div></div>
          )}

          {/* Next Chapter */}
          {nextChapter ? (
            <Link href={`/chapters/${nextChapter.slug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-colors"
              >
                <span>Next: {nextChapter.title}</span>
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
            </Link>
          ) : (
            <div></div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
        imageCaption={modalImage?.caption}
        images={allStoryImages}
        currentIndex={currentImageIndex}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
}
