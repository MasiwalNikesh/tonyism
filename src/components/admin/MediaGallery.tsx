"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TestimonyImage {
  filename: string;
  path: string;
  page?: number;
  title?: string;
  author?: string;
  size?: number;
  lastModified?: Date;
  isPageBased?: boolean; // Indicates if this follows the page naming convention
  sectionTitle?: string;
  sectionPage?: number;
  photoNumber?: number;
}

interface PaginationData {
  current: number;
  total: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ImagesResponse {
  images: TestimonyImage[];
  pagination: PaginationData;
  totalImages: number;
}

interface MediaGalleryProps {
  onSelectImage?: (image: TestimonyImage) => void;
  selectedImages?: string[];
  mode?: 'select' | 'gallery';
  testimonyPage?: number;
}

export default function MediaGallery({ 
  onSelectImage, 
  selectedImages = [], 
  mode = 'gallery',
  testimonyPage 
}: MediaGalleryProps) {
  const [images, setImages] = useState<TestimonyImage[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState(testimonyPage?.toString() || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<TestimonyImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadImages();
  }, [currentPage, search, pageFilter]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });

  const loadImages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
      });
      
      if (search) params.append('search', search);
      if (pageFilter) params.append('pageNumber', pageFilter);
      
      const response = await fetch(`/api/admin/images?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data: ImagesResponse = await response.json();
        setImages(data.images);
        setPagination(data.pagination);
      } else {
        throw new Error('Failed to load images');
      }
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageClick = (image: TestimonyImage) => {
    if (mode === 'select' && onSelectImage) {
      onSelectImage(image);
    } else {
      setSelectedImage(image);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-black">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">
            {mode === 'select' ? 'Select Images' : 'Media Gallery'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-black"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <input
              type="number"
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              placeholder="Filter by page number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {pagination && `${pagination.totalItems} images found`}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Image Grid/List */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.filename}
                className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                  selectedImages.includes(image.path) ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.path}
                    alt={image.title || image.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16.66vw"
                  />
                </div>
                <div className="p-2">
                  <div className="text-xs text-black font-medium truncate">
                    {image.title || image.filename}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    {image.page && (
                      <div className="text-xs text-gray-500">Page {image.page}</div>
                    )}
                    {image.isPageBased && (
                      <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        Auto
                      </span>
                    )}
                  </div>
                  {image.isPageBased && image.sectionTitle && (
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {image.sectionTitle}
                      {image.photoNumber && ` #${image.photoNumber}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {images.map((image) => (
              <div
                key={image.filename}
                className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedImages.includes(image.path) ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => handleImageClick(image)}
              >
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={image.path}
                    alt={image.title || image.filename}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>
                <div className="ml-4 flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-black truncate">
                      {image.title || image.filename}
                    </div>
                    {image.isPageBased && (
                      <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        Auto
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {image.page && `Page ${image.page} • `}
                    {image.size && formatFileSize(image.size)}
                  </div>
                  {image.isPageBased && image.sectionTitle && (
                    <div className="text-xs text-gray-400">
                      {image.sectionTitle}
                      {image.photoNumber && ` #${image.photoNumber}`}
                    </div>
                  )}
                  {image.author && (
                    <div className="text-xs text-gray-600">by {image.author}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No images found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {pagination.current} of {pagination.total}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-black"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-black"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && mode === 'gallery' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {selectedImage.title || selectedImage.filename}
                </h3>
                {selectedImage.page && (
                  <p className="text-sm text-gray-600">Page {selectedImage.page}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <div className="relative">
                <Image
                  src={selectedImage.path}
                  alt={selectedImage.title || selectedImage.filename}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}