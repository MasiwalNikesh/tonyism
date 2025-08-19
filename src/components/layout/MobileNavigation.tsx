"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import React from "react";
import { 
  Home, 
  Heart, 
  BookOpen, 
  MessageCircle, 
  Menu, 
  X,
  Search,
  ChefHat,
  Baby
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  description?: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    color: "amber",
    description: "Welcome to Tonyism"
  },
  {
    href: "/testimonies",
    label: "Testimonies", 
    icon: Heart,
    color: "rose",
    description: "Stories from loved ones"
  },
  {
    href: "/recipes",
    label: "Recipes",
    icon: ChefHat,
    color: "orange",
    description: "Tony's favorite dishes"
  },
  {
    href: "/stories",
    label: "Stories",
    icon: Baby,
    color: "purple",
    description: "Children's stories & poems"
  },
  {
    href: "/chapters",
    label: "Chapters",
    icon: BookOpen,
    color: "blue",
    description: "Life in chapters"
  },
  {
    href: "/chat",
    label: "Chat",
    icon: MessageCircle,
    color: "green",
    description: "Talk with Tony's wisdom"
  }
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-sm border-t-2 border-amber-200 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center p-2 min-w-[60px] transition-all duration-200",
                    isActive 
                      ? "text-amber-600" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isActive && "bg-amber-100"
                    )}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <span className="text-xs font-medium mt-1 text-center">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-t-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Header Navigation */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-sm border-b-2 border-amber-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-lg">T</span>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-gray-900">Tonyism</div>
                  <div className="text-xs text-gray-600">Memories & Wisdom</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                        isActive
                          ? "bg-amber-100 text-amber-800 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Search (Desktop only) */}
              <div className="hidden lg:block">
                <Link
                  href="/testimonies"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Search size={16} />
                  <span className="text-sm text-gray-600">Search testimonies...</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu (for larger mobile screens) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-amber-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 z-40 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl font-serif font-bold text-amber-800 mb-2">
                  Tonyism
                </h1>
                <p className="text-amber-600 italic">
                  Memories, Stories & Legacy
                </p>
              </motion.div>

              {/* Navigation Items */}
              <div className="space-y-4 w-full max-w-sm">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 transition-all w-full",
                          isActive
                            ? "bg-white border-amber-300 shadow-lg text-amber-800"
                            : "bg-white/70 border-gray-200 hover:border-amber-200 hover:bg-white text-gray-700"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          isActive 
                            ? item.color === 'rose' ? "bg-rose-100 text-rose-600" 
                              : item.color === 'amber' ? "bg-amber-100 text-amber-600"
                              : item.color === 'orange' ? "bg-orange-100 text-orange-600"
                              : item.color === 'purple' ? "bg-purple-100 text-purple-600"
                              : item.color === 'blue' ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="font-serif font-semibold text-lg">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-sm opacity-70">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 pt-8"
              >
                <Link
                  href="/testimonies"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Search size={16} />
                  <span>Search Stories</span>
                </Link>
                <Link
                  href="/chapters"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Read Chapters</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-16" />
      <div className="h-16 md:h-0" /> {/* Bottom padding for mobile nav */}
    </>
  );
}