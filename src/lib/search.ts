import Fuse from "fuse.js";
import testimoniesData from "@/data/testimonies.json";

export interface Testimony {
  id: string;
  title: string;
  author: string;
  relationship: string;
  content: string;
  page: number;
  category: "family" | "elders" | "friends" | "colleagues";
  tags: string[];
  chapter: string;
  images?: string[]; // Array of image paths from CMS
  pageRange?: {
    start: number;
    end: number;
  };
  imagesCaptions?: { [imagePath: string]: string }; // Custom captions for images
}

export interface SearchFilters {
  category?: string;
  relationship?: string;
  tags?: string[];
  author?: string;
}

export interface SearchResult {
  item: Testimony;
  score?: number;
  matches?: Array<{
    indices: readonly [number, number][];
    key?: string;
    refIndex?: number;
    value?: string;
  }>;
}

// Fuse.js options for fuzzy search
const fuseOptions = {
  keys: [
    { name: "title", weight: 0.3 },
    { name: "author", weight: 0.2 },
    { name: "content", weight: 0.4 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

class TestimonySearch {
  private fuse: Fuse<Testimony>;
  private allTestimonies: Testimony[];

  constructor() {
    this.allTestimonies = testimoniesData as Testimony[];
    this.fuse = new Fuse(this.allTestimonies, fuseOptions);
  }

  // Main search function
  search(query: string, filters?: SearchFilters): SearchResult[] {
    let results: SearchResult[];

    if (query.trim()) {
      // Use fuzzy search for non-empty queries
      const fuseResults = this.fuse.search(query);
      results = fuseResults.map((result) => ({
        item: result.item,
        score: result.score,
        matches: result.matches ? [...result.matches] : undefined,
      }));
    } else {
      // Return all testimonies if no query
      results = this.allTestimonies.map((item) => ({ item }));
    }

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    return results;
  }

  // Filter testimonies based on criteria
  private applyFilters(
    results: SearchResult[],
    filters: SearchFilters
  ): SearchResult[] {
    return results.filter(({ item }) => {
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      if (filters.relationship && item.relationship !== filters.relationship) {
        return false;
      }

      if (
        filters.author &&
        !item.author.toLowerCase().includes(filters.author.toLowerCase())
      ) {
        return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          item.tags.some((itemTag) =>
            itemTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }

  // Get unique values for filter options
  getFilterOptions() {
    const categories = [...new Set(this.allTestimonies.map((t) => t.category))];
    const relationships = [
      ...new Set(this.allTestimonies.map((t) => t.relationship)),
    ];
    const authors = [...new Set(this.allTestimonies.map((t) => t.author))];
    const allTags = [...new Set(this.allTestimonies.flatMap((t) => t.tags))];

    return {
      categories: categories.sort(),
      relationships: relationships.sort(),
      authors: authors.sort(),
      tags: allTags.sort(),
    };
  }

  // Get testimony by ID
  getTestimonyById(id: string): Testimony | undefined {
    return this.allTestimonies.find((t) => t.id === id);
  }

  // Get testimonies by category
  getTestimoniesByCategory(category: string): Testimony[] {
    return this.allTestimonies.filter((t) => t.category === category);
  }

  // Get featured testimonies (for homepage)
  getFeaturedTestimonies(count: number = 6): Testimony[] {
    const featured = [
      "foreword", // Editorial foreword
      "hum-do-humare-char", // Poonam Batra (Wife)
      "letter-from-son-to-son", // Ashish Batra (Son)
      "mere-papa-with-love", // Divya Batra (Daughter)
      "dear-papa-soumya", // Soumya (Daughter-in-law)
      "meethi-reet", // Nikesh Masiwal (Son-in-law)
    ];

    return featured
      .map((id) => this.getTestimonyById(id))
      .filter(Boolean)
      .slice(0, count) as Testimony[];
  }

  // Get statistics
  getStats() {
    const categoryCounts = this.allTestimonies.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.allTestimonies.length,
      categories: categoryCounts,
    };
  }

  // Get all testimonies
  getAllTestimonies(): Testimony[] {
    return this.allTestimonies;
  }
}

// Export singleton instance
export const testimonySearch = new TestimonySearch();

// Helper function to highlight search matches
export function highlightMatches(
  text: string,
  matches?: Array<{
    indices: readonly [number, number][];
    key?: string;
    refIndex?: number;
    value?: string;
  }>
): string {
  if (!matches || matches.length === 0) return text;

  let highlightedText = text;
  const highlights: { start: number; end: number }[] = [];

  matches.forEach((match) => {
    if (match.key === "content" || match.key === "title") {
      match.indices.forEach(([start, end]: [number, number]) => {
        highlights.push({ start, end: end + 1 });
      });
    }
  });

  // Sort highlights by start position (descending) to replace from end to start
  highlights.sort((a, b) => b.start - a.start);

  highlights.forEach(({ start, end }) => {
    const before = highlightedText.slice(0, start);
    const highlighted = highlightedText.slice(start, end);
    const after = highlightedText.slice(end);
    highlightedText = `${before}<mark class="bg-yellow-200 px-1 rounded">${highlighted}</mark>${after}`;
  });

  return highlightedText;
}

// Helper function to truncate content for search results
export function truncateContent(
  content: string,
  maxLength: number = 200
): string {
  if (content.length <= maxLength) return content;

  const truncated = content.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  return (
    (lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated) +
    "..."
  );
}
