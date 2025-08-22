"use client";

import { motion } from "framer-motion";
import { Baby, Heart, Star, BookOpen } from "lucide-react";
import Link from "next/link";
import { testimonySearch, Testimony } from "@/lib/search";
import { useEffect, useState } from "react";

export default function StoriesPage() {
  const [childrenStories, setChildrenStories] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load and filter testimonies
  useEffect(() => {
    async function loadStories() {
      try {
        await testimonySearch.loadTestimonies();
        const allTestimonies = await testimonySearch.getAllTestimonies();
        
        // Filter testimonies that are children's stories, poems, or from children
        const filteredStories = allTestimonies.filter(
          (testimony) =>
            testimony.id.includes("elephant-king") ||
            testimony.id.includes("tiny-section") ||
            testimony.id.includes("nana") ||
            testimony.id.includes("nanu") ||
            testimony.id.includes("granddaughter") ||
            testimony.id.includes("chopra") ||
            testimony.id.includes("arora") ||
            testimony.id.includes("aaradhya") ||
            testimony.id.includes("khushi") ||
            testimony.id.includes("suhaani") ||
            testimony.id.includes("eshika") ||
            testimony.title.toLowerCase().includes("child") ||
            testimony.title.toLowerCase().includes("story") ||
            testimony.content.toLowerCase().includes("elephant") ||
            testimony.relationship.toLowerCase().includes("granddaughter") ||
            testimony.relationship.toLowerCase().includes("grandson")
        );
        
        setChildrenStories(filteredStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadStories();
  }, []);

  // Featured story (Elephant King)
  const elephantKingStory = childrenStories.find((story) =>
    story.id.includes("elephant-king")
  );
  const grandchildrenStories = childrenStories.filter(
    (story) =>
      story.id.includes("nana") ||
      story.id.includes("nanu") ||
      story.id.includes("chopra") ||
      story.id.includes("arora")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="text-purple-600" size={48} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-purple-800">
              Children&apos;s Stories & Poems
            </h1>
          </div>
          <p className="text-lg text-purple-700 font-serif italic max-w-2xl mx-auto">
            &ldquo;A collection of heartfelt stories and memories from
            Tony&apos;s grandchildren, plus the beloved Elephant King tale that
            captures his spirit of love and giving.&rdquo;
          </p>
        </motion.div>

        {/* Featured Story - Elephant King */}
        {elephantKingStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12"
          >
            <Link href={`/testimonies/${elephantKingStory.id}`}>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Star className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold">
                      {elephantKingStory.title}
                    </h2>
                    <p className="text-purple-100">
                      By {elephantKingStory.author} •{" "}
                      {elephantKingStory.relationship}
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-lg leading-relaxed line-clamp-3">
                  {elephantKingStory.content.substring(0, 200)}...
                </p>
                <div className="mt-4 flex items-center gap-2 text-purple-100">
                  <BookOpen size={16} />
                  <span>Read the full story →</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grandchildren Stories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-purple-800 mb-6 text-center">
            Messages from Tony&apos;s Grandchildren
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grandchildrenStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Link href={`/testimonies/${story.id}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-purple-100 hover:border-purple-300 h-full">
                    {/* Story Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          By {story.author}
                        </p>
                      </div>
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Heart className="text-purple-600" size={16} />
                      </div>
                    </div>

                    {/* Story Preview */}
                    <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                      {story.content.substring(0, 120)}...
                    </p>

                    {/* Story Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{story.relationship}</span>
                      <span>Page {story.page}</span>
                    </div>

                    {/* View Story Button */}
                    <div className="pt-4 border-t border-purple-100">
                      <span className="text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors">
                        Read Message →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Children Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-purple-800 mb-6 text-center">
            All Children&apos;s Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : (
              childrenStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.6 }}
                className="group"
              >
                <Link href={`/testimonies/${story.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-purple-100 hover:border-purple-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-sm text-purple-600">
                          {story.author} • {story.relationship}
                        </p>
                      </div>
                      <div className="text-purple-400 group-hover:text-purple-600 transition-colors">
                        <BookOpen size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
            )}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200 mb-12"
        >
          <h2 className="text-2xl font-serif font-bold text-purple-800 mb-4 text-center">
            For the Little Ones
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            This special section is dedicated to the children in Tony&apos;s
            life and the children who will come to know him through these
            stories. Here you&apos;ll find loving messages from his
            grandchildren and the whimsical tale of &ldquo;Tony, the Elephant
            King&rdquo; - a story that captures his generous spirit and love for
            feeding everyone around him.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center space-x-4"
        >
          <Link href="/recipes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-orange-600 text-white font-serif rounded-lg shadow-lg hover:bg-orange-700 transition-colors"
            >
              Tony&apos;s Recipes
            </motion.button>
          </Link>
          <Link href="/testimonies">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white font-serif rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
            >
              All Testimonies
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
