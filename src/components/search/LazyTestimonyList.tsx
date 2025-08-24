"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Filter, ArrowUp } from 'lucide-react';
import { testimonySearch, Testimony, PaginatedResponse } from '@/lib/search';
import TestimonyCard from '@/components/testimony/TestimonyCard';

interface LazyTestimonyListProps {
  initialSearch?: string;
  initialCategory?: string;
  pageSize?: number;
}

export default function LazyTestimonyList({
  initialSearch = '',
  initialCategory = '',
  pageSize = 25
}: LazyTestimonyListProps) {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  const loadTestimonies = useCallback(async (
    page = 1, 
    searchTerm = search, 
    categoryFilter = category,
    append = false
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
        setTestimonies([]);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const result = await testimonySearch.getPaginatedTestimonies(
        page,
        pageSize,
        searchTerm || undefined,
        categoryFilter || undefined
      );

      if (result) {
        const newTestimonies = result.data;
        
        if (append && page > 1) {
          setTestimonies(prev => [...prev, ...newTestimonies]);
        } else {
          setTestimonies(newTestimonies);
        }

        setHasNextPage(result.pagination.hasNextPage);
        setTotalCount(result.pagination.totalCount);
        setCurrentPage(page);
      } else {
        setError('Failed to load testimonies. Please try again.');
      }
    } catch (err) {
      console.error('Error loading testimonies:', err);
      setError('Failed to load testimonies. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, category, pageSize]);

  // Load more testimonies when intersection observer triggers
  const loadMore = useCallback(() => {
    if (!loadingMore && hasNextPage) {
      loadTestimonies(currentPage + 1, search, category, true);
    }
  }, [loadTestimonies, currentPage, search, category, loadingMore, hasNextPage]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadTestimonies(1, value, category, false);
    }, 300);
  };

  // Handle category filter
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    loadTestimonies(1, search, value, false);
  };

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial load
  useEffect(() => {
    loadTestimonies(1, search, category, false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search testimonies by name, title, or content..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm min-w-[160px]"
            >
              <option value="">All Categories</option>
              <option value="family">Family</option>
              <option value="elders">Elders</option>
              <option value="friends">Friends</option>
              <option value="colleagues">Colleagues</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        {!loading && (
          <div className="text-sm text-gray-600 flex justify-between items-center">
            <span>
              Showing {testimonies.length} of {totalCount} testimonies
              {search && ` for "${search}"`}
              {category && ` in ${category}`}
            </span>
            {(search || category) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  loadTestimonies(1, '', '', false);
                }}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => loadTestimonies(1, search, category, false)}
            className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Initial Loading State */}
      {loading && testimonies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
          <p className="text-gray-600 text-lg">Loading testimonies...</p>
          <p className="text-gray-500 text-sm">Please wait while we gather beautiful memories</p>
        </div>
      )}

      {/* Testimonies Grid */}
      {!loading && (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {testimonies.map((testimony, index) => (
              <motion.div
                key={`${testimony.id}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: (index % pageSize) * 0.05 }}
              >
                <TestimonyCard testimony={testimony} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* No Results */}
      {!loading && testimonies.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No testimonies found</h3>
          <p className="text-gray-600">
            {search || category ? 'Try adjusting your search or filters' : 'No testimonies available at the moment'}
          </p>
        </div>
      )}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-10">
        {loadingMore && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin text-amber-500 mr-2" size={20} />
            <span className="text-gray-600">Loading more...</span>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg z-40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}