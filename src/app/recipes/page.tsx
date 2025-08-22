"use client";

import { motion } from "framer-motion";
import { ChefHat, Clock, Users } from "lucide-react";
import Link from "next/link";
import { testimonySearch, Testimony } from "@/lib/search";
import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load and filter testimonies
  useEffect(() => {
    async function loadRecipes() {
      try {
        await testimonySearch.loadTestimonies();
        const allTestimonies = await testimonySearch.getAllTestimonies();
        
        // Filter testimonies that are recipes (based on id and content keywords)
        const filteredRecipes = allTestimonies.filter(
          (testimony) =>
            testimony.id.includes("recipe") ||
            testimony.id.includes("kitchen") ||
            testimony.id.includes("food") ||
            testimony.id.includes("feeding") ||
            testimony.id.includes("namkeen") ||
            testimony.id.includes("laddu") ||
            testimony.id.includes("barfi") ||
            testimony.id.includes("bharta") ||
            testimony.id.includes("kadhi") ||
            testimony.title.toLowerCase().includes("recipe") ||
            testimony.title.toLowerCase().includes("food") ||
            testimony.content.toLowerCase().includes("recipe") ||
            testimony.content.toLowerCase().includes("cooking")
        );
        
        setRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="text-orange-600" size={48} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-orange-800">
              Tony&apos;s Kitchen
            </h1>
          </div>
          <p className="text-lg text-orange-700 font-serif italic max-w-2xl mx-auto">
            &ldquo;Food was never just about eating for Tony – it was about
            love, care, and bringing people together. Here are his favorite
            recipes and the philosophy behind his love for feeding
            others.&rdquo;
          </p>
        </motion.div>

        {/* Recipe Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <Link href={`/testimonies/${recipe.id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-orange-100 hover:border-orange-300">
                  {/* Recipe Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-orange-600 font-medium">
                        By {recipe.author}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <ChefHat className="text-orange-600" size={20} />
                    </div>
                  </div>

                  {/* Recipe Preview */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {recipe.content.substring(0, 150)}...
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{recipe.relationship}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Page {recipe.page}</span>
                    </div>
                  </div>

                  {/* View Recipe Button */}
                  <div className="mt-4 pt-4 border-t border-orange-100">
                    <span className="text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors">
                      View Recipe & Story →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
          )}
        </motion.div>

        {/* Food Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200"
        >
          <h2 className="text-2xl font-serif font-bold text-orange-800 mb-4 text-center">
            Tony&apos;s Food Philosophy
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Love for Feeding
              </h3>
              <p className="text-gray-600">
                &ldquo;Tony had a very special power - he loved feeding others.
                Not just anyone, but especially children. And he did it with
                love, the kind often seen in mothers and grandmothers.&rdquo;
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Attention to Detail
              </h3>
              <p className="text-gray-600">
                &ldquo;He was quite particular about how he liked some of his
                favorite items. For instance, the way the tea bag needs to mix
                with the water before the &lsquo;2 spoons&rsquo; of milk comes
                in.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex justify-center flex-wrap gap-4 mt-12"
        >
          <Link href="/testimonies">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-orange-600 text-white font-serif rounded-lg shadow-lg hover:bg-orange-700 transition-colors"
            >
              View All Testimonies
            </motion.button>
          </Link>
          <Link href="/stories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white font-serif rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
            >
              Children&apos;s Stories
            </motion.button>
          </Link>
          <Link href="/ngo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-serif rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Tony&apos;s NGO Legacy
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
