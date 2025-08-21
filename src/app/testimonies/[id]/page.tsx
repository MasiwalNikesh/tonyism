"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  User,
  Tag,
  Calendar,
  Share2,
  BookOpen,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { testimonySearch } from "@/lib/search";
import { getTestimonyImageSources } from "@/lib/images";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageModal from "@/components/ImageModal";
import RichTextRenderer from "@/components/RichTextRenderer";

interface TestimonyPageProps {
  params: Promise<{
    id: string;
  }>;
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

export default function TestimonyPage({ params }: TestimonyPageProps) {
  const { id } = use(params);
  const testimony = testimonySearch.getTestimonyById(id);

  // Modal state
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!testimony) {
    notFound();
  }

  // Get all testimonies sorted by page for navigation
  const allTestimonies = testimonySearch.getAllTestimonies().sort((a, b) => a.page - b.page);
  const currentIndex = allTestimonies.findIndex(t => t.id === testimony.id);
  const previousTestimony = currentIndex > 0 ? allTestimonies[currentIndex - 1] : null;
  const nextTestimony = currentIndex < allTestimonies.length - 1 ? allTestimonies[currentIndex + 1] : null;

  // Get related testimonies (same category or author)
  const relatedTestimonies = testimonySearch
    .search("", { category: testimony.category })
    .filter((result) => result.item.id !== testimony.id)
    .slice(0, 3)
    .map((result) => result.item);

  // Content will be rendered as rich text, no need to split into paragraphs

  // Get images for this testimony
  const { profileImage, galleryImages } = getTestimonyImageSources(testimony);

  // Convert gallery images to modal format
  const modalImages = galleryImages.map(img => ({
    src: img.src,
    alt: img.alt,
    caption: img.caption
  }));

  // Handle image click
  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setModalImage(modalImages[imageIndex]);
  };

  // Handle modal navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    let newIndex = currentImageIndex;
    if (direction === 'prev' && currentImageIndex > 0) {
      newIndex = currentImageIndex - 1;
    } else if (direction === 'next' && currentImageIndex < modalImages.length - 1) {
      newIndex = currentImageIndex + 1;
    }
    
    setCurrentImageIndex(newIndex);
    setModalImage(modalImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/testimonies"
              onClick={() => {
                // Set flag to indicate we're returning from detail page
                sessionStorage.setItem('returned-from-detail', 'true');
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-all"
              >
                <ArrowLeft size={18} />
                <span>Back to Testimonies</span>
              </motion.button>
            </Link>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${testimony.title} - Tony Batra Testimonies`,
                    text: `Read this beautiful testimony by ${testimony.author}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">
              {categoryIcons[testimony.category]}
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium border",
                categoryColors[testimony.category]
              )}
            >
              {testimony.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            {testimony.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium text-lg">{testimony.author}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="italic">{testimony.relationship}</span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Page {testimony.page}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-xl shadow-2xl border-4 border-amber-200 overflow-hidden mb-8"
        >
          {/* Book Spine Effect */}

          <div className="relative z-10 p-8 md:p-12">
            {/* Author Avatar */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg border-4 border-amber-200">
                <Image
                  src={profileImage}
                  alt={`${testimony.author} profile`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <RichTextRenderer content={testimony.content} />
            </motion.div>

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Memories & Photos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galleryImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 cursor-pointer group"
                      onClick={() => handleImageClick(index)}
                    >
                      <div className="relative">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width || 600}
                          height={image.height || 400}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      {image.caption && (
                        <div className="p-3 bg-white">
                          <p className="text-sm text-gray-600 italic">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {testimony.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag size={18} />
                  Themes & Memories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {testimony.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/testimonies?tags=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <Tag size={12} />
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chapter Reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <BookOpen size={18} />
                  <span className="font-medium">
                    From:{" "}
                    {testimony.chapter
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <Link
                  href={`/chapters/${testimony.chapter}`}
                  className="text-sm text-amber-700 hover:text-amber-800 underline"
                >
                  View Chapter
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.article>

        {/* Previous/Next Navigation */}
        {(previousTestimony || nextTestimony) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between gap-4">
              {previousTestimony ? (
                <Link
                  href={`/testimonies/${previousTestimony.id}`}
                  className="flex-1 group"
                  onClick={() => {
                    sessionStorage.setItem('returned-from-detail', 'true');
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full text-amber-600 group-hover:bg-amber-200 transition-colors">
                      <ChevronLeft size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-gray-500 mb-1">Previous</p>
                      <h3 className="font-serif font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {previousTestimony.title}
                      </h3>
                      <p className="text-sm text-gray-600">Page {previousTestimony.page}</p>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextTestimony ? (
                <Link
                  href={`/testimonies/${nextTestimony.id}`}
                  className="flex-1 group"
                  onClick={() => {
                    sessionStorage.setItem('returned-from-detail', 'true');
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex-1 text-right">
                      <p className="text-sm text-gray-500 mb-1">Next</p>
                      <h3 className="font-serif font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {nextTestimony.title}
                      </h3>
                      <p className="text-sm text-gray-600">Page {nextTestimony.page}</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full text-amber-600 group-hover:bg-amber-200 transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </motion.section>
        )}

        {/* Related Testimonies */}
        {relatedTestimonies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              More from {testimony.category} stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTestimonies.map((related) => (
                <Link
                  key={related.id}
                  href={`/testimonies/${related.id}`}
                  className="group block bg-white rounded-lg border-2 border-gray-200 hover:border-amber-300 p-4 transition-all hover:shadow-lg"
                >
                  <h3 className="font-serif font-semibold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {related.author}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {related.content.substring(0, 150)}...
                  </p>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
        imageCaption={modalImage?.caption}
        images={modalImages}
        currentIndex={currentImageIndex}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
}
