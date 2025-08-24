"use client";

import { motion } from "framer-motion";
import { Heart, Users, Play, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NGOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-red-500" size={48} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
              Tony&apos;s NGO Legacy
            </h1>
          </div>
          <p className="text-lg text-gray-700 font-serif italic max-w-3xl mx-auto">
            &ldquo;Tony believed in giving back to the community and helping
            those in need. His charitable spirit lives on through the
            organizations and causes he supported.&rdquo;
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-200">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Play className="text-white" size={24} />
                <h2 className="text-2xl font-serif font-bold">
                  Small Contribution, Big Impact
                </h2>
              </div>
              <p className="text-blue-100">
                Generosity touched countless lives
              </p>
            </div>
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/2xMscbLq01k"
                title="Tony's NGO Impact Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* NGO Information Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex justify-center mb-16"
        >
          {/* Single Card - Food Security/Nutrition Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-100 hover:border-green-300 transition-colors max-w-2xl"
          >
            <div className="bg-green-100 p-4 rounded-lg w-fit mb-6 mx-auto">
              <Heart className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 text-center">
              Nutrition Programs
            </h3>
            <p className="text-gray-600 mb-6 text-center text-lg">
              Extending his love for feeding others through Apna Ghar Ashram
              community kitchens and nutrition programs, ensuring no one goes
              hungry.
            </p>
            <div className="text-center text-green-600 font-semibold text-lg">
              Impact: 5,000+ meals served monthly
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action - Support Apna Ghar Ashram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-10 text-center mb-12 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="text-pink-200" size={40} />
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Support Apna Ghar Ashram
              </h2>
              <Heart className="text-pink-200" size={40} />
            </div>
            <div className="bg-white/20 rounded-lg p-4 mb-6 inline-block">
              <p className="text-xl font-serif italic">
                In loving memory of Gajender Batra
              </p>
            </div>
            <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Continue Tony&apos;s legacy of compassion by supporting the Apna
              Ghar Ashram. Your contribution helps provide meals, shelter, and
              hope to those in need, just as Tony would have wanted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://milaap.org/fundraisers/support-one-of-their-centres-in-pooth-khurd-delhid"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-indigo-600 font-serif font-bold text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-block text-center"
              >
                🤝 Donate Now - Support Pooth Khurd Centre
              </a>
            </div>
            <div className="mt-6 text-indigo-200 text-sm">
              Every contribution makes a difference in someone&apos;s life
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="flex justify-center space-x-4"
        >
          <Link href="/testimonies">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-orange-600 text-white font-serif rounded-lg shadow-lg hover:bg-orange-700 transition-colors"
            >
              Read Testimonies
            </motion.button>
          </Link>
          <Link href="/recipes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white font-serif rounded-lg shadow-lg hover:bg-green-700 transition-colors"
            >
              Tony&apos;s Recipes
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
