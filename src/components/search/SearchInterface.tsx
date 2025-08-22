"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Users,
  Heart,
  Briefcase,
  Crown,
} from "lucide-react";
import { testimonySearch, SearchFilters, SearchResult } from "@/lib/search";
import TestimonyCard from "@/components/testimony/TestimonyCard";
import { cn } from "@/lib/utils";

interface SearchInterfaceProps {
  initialQuery?: string;
  className?: string;
}

const categoryConfig = {
  family: { icon: Heart, label: "Family", color: "rose" },
  elders: { icon: Crown, label: "Elders", color: "amber" },
  friends: { icon: Users, label: "Friends", color: "blue" },
  colleagues: { icon: Briefcase, label: "Colleagues", color: "green" },
};

type SortOption = "relevance" | "author" | "title" | "page";

export default function SearchInterface({
  initialQuery = "",
  className,
}: SearchInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("page");

  // State for filter options and stats
  const [filterOptions, setFilterOptions] = useState<{ authors: string[], relationships: string[], tags: string[], categories?: string[] }>({ authors: [], relationships: [], tags: [] });
  const [stats, setStats] = useState({ total: 0, categories: { family: 0, friends: 0, elders: 0, colleagues: 0 } });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        await testimonySearch.loadTestimonies();
        const options = await testimonySearch.getFilterOptions();
        const statsData = await testimonySearch.getStats();
        setFilterOptions(options);
        setStats({
          total: statsData.total,
          categories: {
            family: statsData.categories.family || 0,
            friends: statsData.categories.friends || 0,
            elders: statsData.categories.elders || 0,
            colleagues: statsData.categories.colleagues || 0
          }
        });
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    }
    
    loadData();
  }, []);

  // Perform search
  useEffect(() => {
    async function performSearch() {
      if (!dataLoaded) {
        return;
      }
      
      setIsLoading(true);
      const searchResults = await testimonySearch.search(query, filters);

    // Sort results
    const sortedResults = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.item.author.localeCompare(b.item.author);
        case "title":
          return a.item.title.localeCompare(b.item.title);
        case "page":
          return a.item.page - b.item.page;
        case "relevance":
        default:
          return (a.score || 0) - (b.score || 0);
      }
    });

      setResults(sortedResults);
      setIsLoading(false);
    }
    
    performSearch();
  }, [query, filters, sortBy, dataLoaded]);

  // Handle filter changes
  const updateFilter = (
    key: keyof SearchFilters,
    value: string | string[] | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setQuery("");
  };

  // Active filter count
  const activeFilterCount =
    Object.values(filters).filter(Boolean).length + (query ? 1 : 0);

  return (
    <div className={cn("max-w-7xl mx-auto", className)}>
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search testimonies, names, memories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filter Toggle and Quick Stats */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  showFilters
                    ? "bg-amber-100 border-amber-300 text-amber-800"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{results.length} testimonies found</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="page">Sort by Page</option>
                <option value="relevance">Sort by Relevance</option>
                <option value="author">Sort by Author</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          {/* Category Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const Icon = config.icon;
              const isActive = filters.category === category;
              const count = stats.categories[category as keyof typeof stats.categories] || 0;

              return (
                <button
                  key={category}
                  onClick={() =>
                    updateFilter("category", isActive ? undefined : category)
                  }
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-sm",
                    isActive
                      ? config.color === "rose"
                        ? "bg-rose-100 border-rose-300 text-rose-800"
                        : config.color === "amber"
                        ? "bg-amber-100 border-amber-300 text-amber-800"
                        : config.color === "blue"
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-green-100 border-green-300 text-green-800"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon size={14} />
                  <span>{config.label}</span>
                  <span className="bg-white/70 text-xs px-1.5 py-0.5 rounded">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Relationship Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    value={filters.relationship || ""}
                    onChange={(e) =>
                      updateFilter("relationship", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">All relationships</option>
                    {filterOptions.relationships.map((relationship) => (
                      <option key={relationship} value={relationship}>
                        {relationship}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <select
                    value={filters.author || ""}
                    onChange={(e) => updateFilter("author", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">All authors</option>
                    {filterOptions.authors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {filterOptions.tags.slice(0, 15).map((tag) => {
                      const isSelected = filters.tags?.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = filters.tags || [];
                            const newTags = isSelected
                              ? currentTags.filter((t) => t !== tag)
                              : [...currentTags, tag];
                            updateFilter(
                              "tags",
                              newTags.length > 0 ? newTags : undefined
                            );
                          }}
                          className={cn(
                            "px-2 py-1 text-xs rounded border transition-all",
                            isSelected
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, index) => (
            <TestimonyCard
              key={result.item.id}
              testimony={result.item}
              matches={result.matches}
              index={index}
              variant="default"
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No testimonies found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
