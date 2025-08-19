"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useCallback, useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  currentIndex?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  imageCaption,
  images,
  currentIndex,
  onNavigate,
}: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset states when image changes
  useEffect(() => {
    if (imageSrc) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [imageSrc]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (onNavigate && images && currentIndex !== undefined && currentIndex > 0) {
          onNavigate('prev');
        }
        break;
      case 'ArrowRight':
        if (onNavigate && images && currentIndex !== undefined && currentIndex < images.length - 1) {
          onNavigate('next');
        }
        break;
    }
  }, [isOpen, onClose, onNavigate, images, currentIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const showNavigation = images && images.length > 1 && currentIndex !== undefined && onNavigate;
  const canGoPrev = showNavigation && currentIndex > 0;
  const canGoNext = showNavigation && currentIndex < images.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.1 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
          aria-label="Close modal"
        >
          <X size={24} />
        </motion.button>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            {canGoPrev && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className="absolute left-4 z-60 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}

            {canGoNext && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className="absolute right-4 z-60 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </motion.button>
            )}
          </>
        )}

        {/* Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex items-center justify-center min-h-[400px] bg-gray-100">
            {/* Loading spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
            
            {/* Error state */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p>Failed to load image</p>
                  <p className="text-sm text-gray-400 mt-1">{imageSrc}</p>
                </div>
              </div>
            )}
            
            {/* Use regular img tag for modal to avoid Next.js optimization issues */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className={`w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => {
                console.log('Image loaded:', imageSrc);
                setIsLoading(false);
                setHasError(false);
              }}
              onError={(e) => {
                console.error('Image failed to load:', imageSrc);
                console.error('Error details:', e);
                setIsLoading(false);
                setHasError(true);
              }}
            />
            
            {/* Image Counter */}
            {showNavigation && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Caption */}
          {imageCaption && (
            <div className="p-4 bg-white border-t">
              <p className="text-gray-700 text-sm italic text-center">
                {imageCaption}
              </p>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm text-center opacity-70">
          <p>Press ESC to close{showNavigation && ' • Use arrow keys to navigate'}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}