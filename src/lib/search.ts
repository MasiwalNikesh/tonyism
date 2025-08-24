import Fuse from "fuse.js";

export interface Video {
  id: string;
  url: string;
  type: 'youtube' | 'google_drive' | 'vimeo';
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
}

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
  videos?: Video[]; // Array of videos
  pageRange?: {
    start: number;
    end: number;
  };
  imagesCaptions?: { [imagePath: string]: string }; // Custom captions for images
  videosCaptions?: { [videoId: string]: string }; // Custom captions for videos
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

// Pagination interface for API responses
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalFetched: number;
}

export interface PaginatedResponse {
  data: Testimony[];
  pagination: PaginationInfo;
}

class TestimonySearch {
  private fuse: Fuse<Testimony> | null = null;
  private allTestimonies: Testimony[] = [];
  private isLoaded: boolean = false;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Cache management
  private getCacheKey(params: Record<string, any>): string {
    return JSON.stringify(params);
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  // Load testimonies with pagination (for search and full loading)
  async loadTestimonies(page: number = 1, limit: number = 1000): Promise<void> {
    if (this.isLoaded && page === 1 && limit === 1000) return;
    
    const cacheKey = this.getCacheKey({ action: 'loadAll', page, limit });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      console.log('Using cached testimonies data');
      this.allTestimonies = cached;
      this.fuse = new Fuse(this.allTestimonies, fuseOptions);
      this.isLoaded = true;
      return;
    }
    
    try {
      console.log('Loading testimonies from API...');
      const response = await fetch(`/api/testimonials?page=${page}&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        // Handle both old and new API response formats
        const testimonies = result.data || result; // New format has .data, old format is direct array
        
        this.allTestimonies = testimonies;
        console.log(`Loaded ${this.allTestimonies.length} testimonies from database`);
        this.fuse = new Fuse(this.allTestimonies, fuseOptions);
        this.isLoaded = true;
        
        // Cache the result
        this.setCache(cacheKey, testimonies);
      } else {
        console.error('Failed to load testimonies from API, status:', response.status);
      }
    } catch (error) {
      console.error('Error loading testimonies:', error);
    }
  }

  // Get paginated testimonies directly from API
  async getPaginatedTestimonies(
    page: number = 1, 
    limit: number = 25,
    search?: string,
    category?: string
  ): Promise<PaginatedResponse | null> {
    const cacheKey = this.getCacheKey({ action: 'paginated', page, limit, search, category });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      console.log('Using cached paginated data');
      return cached;
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      console.log(`Loading page ${page} with ${limit} testimonies...`);
      const response = await fetch(`/api/testimonials?${params}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Loaded ${result.data?.length || 0} testimonies (page ${page})`);
        
        // Cache the result
        this.setCache(cacheKey, result);
        
        return result;
      } else {
        console.error('Failed to load paginated testimonies from API, status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error loading paginated testimonies:', error);
      return null;
    }
  }

  // Main search function
  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    await this.loadTestimonies();
    
    if (!this.fuse) return [];
    
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
  async getFilterOptions() {
    await this.loadTestimonies();
    
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

  // Get testimony by ID - prefer using API directly for single items
  async getTestimonyById(id: string): Promise<Testimony | null> {
    try {
      const response = await fetch(`/api/testimonials?id=${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching testimony by ID:', error);
      return null;
    }
  }

  // Get testimonies by category
  async getTestimoniesByCategory(category: string): Promise<Testimony[]> {
    await this.loadTestimonies();
    return this.allTestimonies.filter((t) => t.category === category);
  }

  // Get featured testimonies (for homepage)
  async getFeaturedTestimonies(count: number = 6): Promise<Testimony[]> {
    await this.loadTestimonies();
    
    const featured = [
      "foreword", // Editorial foreword
      "hum-do-humare-char", // Poonam Batra (Wife)
      "letter-from-son-to-son", // Ashish Batra (Son)
      "mere-papa-with-love", // Divya Batra (Daughter)
      "dear-papa-soumya", // Soumya (Daughter-in-law)
      "meethi-reet", // Nikesh Masiwal (Son-in-law)
    ];

    const featuredTestimonies: Testimony[] = [];
    for (const id of featured) {
      const testimony = await this.getTestimonyById(id);
      if (testimony) {
        featuredTestimonies.push(testimony);
      }
      if (featuredTestimonies.length >= count) break;
    }
    
    return featuredTestimonies;
  }

  // Get statistics
  async getStats() {
    await this.loadTestimonies();
    
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
  async getAllTestimonies(): Promise<Testimony[]> {
    await this.loadTestimonies();
    return this.allTestimonies;
  }

  // Synchronous version for backwards compatibility (will be empty until loaded)
  getAllTestimoniesSync(): Testimony[] {
    return this.allTestimonies;
  }

  // Synchronous version of getTestimonyById for backwards compatibility
  getTestimonyByIdSync(id: string): Testimony | undefined {
    return this.allTestimonies.find((t) => t.id === id);
  }

  // Synchronous version of search for backwards compatibility
  searchSync(query: string, filters?: SearchFilters): SearchResult[] {
    if (!this.fuse) return [];
    
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

  // Synchronous version of getStats for backwards compatibility
  getStatsSync() {
    const categoryCounts = this.allTestimonies.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.allTestimonies.length,
      categories: categoryCounts,
    };
  }

  // Synchronous version of getFeaturedTestimonies for backwards compatibility
  getFeaturedTestimoniesSync(count: number = 6): Testimony[] {
    const featured = [
      "foreword", // Editorial foreword
      "hum-do-humare-char", // Poonam Batra (Wife)
      "letter-from-son-to-son", // Ashish Batra (Son)
      "mere-papa-with-love", // Divya Batra (Daughter)
      "dear-papa-soumya", // Soumya (Daughter-in-law)
      "meethi-reet", // Nikesh Masiwal (Son-in-law)
    ];

    return featured
      .map((id) => this.getTestimonyByIdSync(id))
      .filter(Boolean)
      .slice(0, count) as Testimony[];
  }

  // Synchronous version of getFilterOptions for backwards compatibility
  getFilterOptionsSync() {
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

// Helper function to parse rich text to plain text
export function parseRichTextToPlainText(content: string): string {
  // Strip markdown formatting for plain text display
  return content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers  
    .replace(/^> (.*$)/gim, '$1')    // Remove quote markers
    .replace(/\n+/g, ' ')            // Replace line breaks with spaces
    .trim();
}

// Helper function to parse rich text to HTML
export function parseRichTextToHTML(content: string): string {
  // Parse markdown-like formatting to HTML (similar to RichTextEditor preview)
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-gray-300 pl-2 italic text-gray-600">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br />');
}

// Helper function to truncate content for search results
export function truncateContent(
  content: string,
  maxLength: number = 200
): string {
  // First convert to plain text to get accurate character count
  const plainText = parseRichTextToPlainText(content);
  if (plainText.length <= maxLength) {
    // If short enough, return the HTML version
    return parseRichTextToHTML(content);
  }
  
  // Truncate the plain text version
  const truncated = plainText.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  const finalText = (lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated) + "...";
  
  // Return as plain text since it's truncated (rich formatting may be broken)
  return finalText;
}
