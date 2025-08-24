"use client";

import { motion } from "framer-motion";
import { Heart, Users, Search, Sparkles } from "lucide-react";
import LazyTestimonyList from "@/components/search/LazyTestimonyList";
import TestimonyCard from "@/components/testimony/TestimonyCard";
import { testimonySearch, Testimony } from "@/lib/search";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TestimoniesPage() {
  const [featuredTestimonies, setFeaturedTestimonies] = useState<Testimony[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: { family: 0, friends: 0, elders: 0, colleagues: 0 } });
  const [isLoading, setIsLoading] = useState(true);

  // Load testimonies data
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting to load testimonies data...');
        await testimonySearch.loadTestimonies();
        console.log('Loaded testimonies, now getting featured...');
        const featured = await testimonySearch.getFeaturedTestimonies(6);
        console.log('Featured testimonies:', featured.length);
        const statsData = await testimonySearch.getStats();
        console.log('Stats data:', statsData);
        
        setFeaturedTestimonies(featured);
        setStats({
          total: statsData.total,
          categories: {
            family: statsData.categories.family || 0,
            friends: statsData.categories.friends || 0,
            elders: statsData.categories.elders || 0,
            colleagues: statsData.categories.colleagues || 0
          }
        });
        console.log('Successfully set featured testimonies and stats');
      } catch (error) {
        console.error('Error loading testimonies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Restore scroll position when returning from testimony detail page
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('testimonies-scroll-position');
    const returnedFromDetail = sessionStorage.getItem('returned-from-detail');
    
    if (savedScrollPosition && returnedFromDetail === 'true') {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        // Clean up the flags
        sessionStorage.removeItem('returned-from-detail');
      }, 100);
    }

    // Clear scroll position when leaving the page
    return () => {
      if (!sessionStorage.getItem('returned-from-detail')) {
        sessionStorage.removeItem('testimonies-scroll-position');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Loading Animation */}
      {isLoading && (
        <>
          {/* Loading Bar */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <motion.div
              className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
          
          {/* Central Loading Message */}
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-800 font-serif text-lg">Loading testimonies...</p>
              <p className="text-amber-600 text-sm mt-2">Please wait while we gather all the beautiful memories</p>
            </motion.div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="text-red-500" size={32} />
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">
                Testimonies of Love
              </h1>
              <Sparkles className="text-amber-500" size={32} />
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover the countless lives touched by Tony&apos;s warmth, wisdom, and love. 
              Search through memories from family, friends, and colleagues who share 
              their stories of how Tony made their world brighter.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span><strong>{stats.total}</strong> testimonies</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-red-400" />
                <span><strong>{stats.categories.family}</strong> family stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <span><strong>{stats.categories.friends}</strong> friend memories</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-1 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Testimonies</span>
            </nav>

            <Link href="/chapters">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-colors"
              >
                View Chapters
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Testimonies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-amber-500" size={24} />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              Featured Stories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : (
              featuredTestimonies.map((testimony, index) => (
                <TestimonyCard
                  key={testimony.id}
                  testimony={testimony}
                  index={index}
                  variant="featured"
                />
              ))
            )}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 border border-amber-200 rounded-full text-amber-800 font-medium"
            >
              <Search size={18} />
              <span>Search below to discover all {stats.total} testimonies</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Lazy Loading Testimony List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <LazyTestimonyList pageSize={25} />
        </motion.section>
      </div>
    </div>
  );
}