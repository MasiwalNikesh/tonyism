"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Testimony } from '@/app/api/admin/testimonials/route';

interface PaginationData {
  current: number;
  total: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface TestimonialsResponse {
  testimonials: Testimony[];
  pagination: PaginationData;
}

interface MetadataResponse {
  categories: string[];
  chapters: string[];
  relationships: string[];
  authors: string[];
  tags: string[];
  pageRange: { min: number; max: number };
  totalTestimonials: number;
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (token !== 'admin123') {
      router.push('/admin');
      return;
    }
    
    loadMetadata();
    loadTestimonials();
  }, [router, currentPage, itemsPerPage, search, categoryFilter, chapterFilter]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });

  const loadMetadata = async () => {
    try {
      const response = await fetch('/api/admin/metadata', {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (chapterFilter) params.append('chapter', chapterFilter);
      
      const response = await fetch(`/api/admin/testimonials?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data: TestimonialsResponse = await response.json();
        setTestimonials(data.testimonials);
        setPagination(data.pagination);
      } else {
        throw new Error('Failed to load testimonials');
      }
    } catch (err) {
      setError('Failed to load testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        loadTestimonials(); // Reload the list
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (err) {
      alert('Failed to delete testimonial');
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
              <p className="text-gray-600">
                {metadata && `${metadata.totalTestimonials} total testimonials`}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin/testimonials/new')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add New Testimonial
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author, content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="">All Categories</option>
                {metadata?.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter
              </label>
              <select
                value={chapterFilter}
                onChange={(e) => setChapterFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="">All Chapters</option>
                {metadata?.chapters.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Testimonials List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimony) => (
                  <tr key={testimony.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {testimony.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimony.author} ({testimony.relationship})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {testimony.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {testimony.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">
                        {truncateText(testimony.content)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {testimony.images && testimony.images.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {testimony.images.length} images
                        </span>
                      ) : (
                        <span className="text-gray-400">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/testimonials/${testimony.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(testimony.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> 
                  {' '}({pagination.totalItems} total testimonials)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}