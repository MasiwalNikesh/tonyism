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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Card 1 - Education Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">
              Education for All
            </h3>
            <p className="text-gray-600 mb-4">
              Support educational initiatives, providing scholarships and
              resources to underprivileged children, believing that education
              was the key to breaking the cycle of poverty.
            </p>
            <div className="text-sm text-blue-600 font-semibold">
              Impact: 150+ scholarships provided
            </div>
          </motion.div>

          {/* Card 2 - Food Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100 hover:border-green-300 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
              <Heart className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">
              Nutrition Programs
            </h3>
            <p className="text-gray-600 mb-4">
              Extending his love for feeding others, Apna Ghar Ashram community
              kitchens and nutrition programs.
            </p>
            <div className="text-sm text-green-600 font-semibold">
              Impact: 5,000+ meals served monthly
            </div>
          </motion.div>

          {/* Card 3 - Healthcare Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors"
          >
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <ExternalLink className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">
              Healthcare Access
            </h3>
            <p className="text-gray-600 mb-4">
              Access to healthcare for families who couldn&apos;t afford it,
              partnering with local clinics and hospitals to provide free
              medical consultations and treatments.
            </p>
            <div className="text-sm text-purple-600 font-semibold">
              Impact: 800+ families helped
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-200 text-center mb-12"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
            Support in name of Shri Gajendra Batra Ji
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto"></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://milaap.org/fundraisers/support-one-of-their-centres-in-pooth-khurd-delhid"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-serif rounded-lg shadow-lg hover:bg-blue-700 transition-colors inline-block text-center"
            >
              Donate Now - Support Pooth Khurd Centre
            </a>
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
