"use client";

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Testimony } from '@/app/api/admin/testimonials/route';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaGallery from '@/components/admin/MediaGallery';
import Image from 'next/image';

interface MetadataResponse {
  categories: string[];
  chapters: string[];
  relationships: string[];
  authors: string[];
  tags: string[];
  pageRange: { min: number; max: number };
  totalTestimonials: number;
}

interface TestimonyImage {
  filename: string;
  path: string;
  page?: number;
  title?: string;
  author?: string;
  size?: number;
  lastModified?: Date;
  isPageBased?: boolean;
  sectionTitle?: string;
  sectionPage?: number;
  photoNumber?: number;
}

export default function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [pageBasedImages, setPageBasedImages] = useState<TestimonyImage[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (token !== 'admin123') {
      router.push('/admin');
      return;
    }
    
    setIsNew(id === 'new');
    loadMetadata();
    
    if (id !== 'new') {
      loadTestimony();
    } else {
      // Initialize empty testimony for new entry
      setTestimony({
        id: '',
        title: '',
        author: '',
        relationship: '',
        content: '',
        page: 1,
        category: 'family',
        tags: [],
        chapter: '',
        images: [],
        pageRange: { start: 1, end: 1 },
        imagesCaptions: {}
      });
      setLoading(false);
    }
  }, [id, router]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });

  const loadMetadata = useCallback(async () => {
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
  }, []);

  const loadTestimony = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestimony(data);
        loadPageBasedImages(data.page, data.pageRange);
      } else {
        setError('Testimony not found');
      }
    } catch (err) {
      setError('Failed to load testimony');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadPageBasedImages = async (pageNumber: number, pageRange?: { start: number; end: number }) => {
    try {
      let pagesToLoad = [pageNumber];
      
      if (pageRange && pageRange.start !== pageRange.end) {
        // Load images for page range
        pagesToLoad = [];
        for (let page = pageRange.start; page <= pageRange.end; page++) {
          pagesToLoad.push(page);
        }
      }
      
      const allImages: TestimonyImage[] = [];
      
      // Load images for each page in the range
      for (const page of pagesToLoad) {
        const params = new URLSearchParams({
          pageNumber: page.toString(),
          limit: '50',
        });
        
        const response = await fetch(`/api/admin/images?${params}`, {
          headers: getAuthHeaders(),
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only page-based images and add them to the collection
          const pageBased = data.images.filter((img: TestimonyImage) => img.isPageBased);
          allImages.push(...pageBased);
        }
      }
      
      // Remove duplicates based on image path
      const uniqueImages = allImages.filter((img, index, self) => 
        index === self.findIndex(i => i.path === img.path)
      );
      
      setPageBasedImages(uniqueImages);
    } catch (err) {
      console.error('Failed to load page-based images:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimony) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(testimony),
      });
      
      if (response.ok) {
        setSuccess(isNew ? 'Testimony created successfully!' : 'Testimony updated successfully!');
        if (isNew) {
          // Redirect to edit mode for the new testimony
          const data = await response.json();
          router.push(`/admin/testimonials/${data.testimony.id}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save testimony');
      }
    } catch (err) {
      setError('Failed to save testimony');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Testimony, value: unknown) => {
    if (!testimony) return;
    const updatedTestimony = { ...testimony, [field]: value };
    setTestimony(updatedTestimony);
    
    // If page number or page range changes, reload page-based images
    if (field === 'page' && typeof value === 'number') {
      loadPageBasedImages(value, updatedTestimony.pageRange);
    } else if (field === 'pageRange') {
      loadPageBasedImages(updatedTestimony.page, value as { start: number; end: number });
    }
  };

  const updateImageCaption = (imagePath: string, caption: string) => {
    if (!testimony) return;
    const updatedCaptions = { ...testimony.imagesCaptions };
    if (caption.trim()) {
      updatedCaptions[imagePath] = caption;
    } else {
      delete updatedCaptions[imagePath];
    }
    updateField('imagesCaptions', updatedCaptions);
  };

  const addTag = (tag: string) => {
    if (!testimony || !tag.trim() || testimony.tags.includes(tag.trim())) return;
    updateField('tags', [...testimony.tags, tag.trim()]);
  };

  const removeTag = (tagToRemove: string) => {
    if (!testimony) return;
    updateField('tags', testimony.tags.filter(tag => tag !== tagToRemove));
  };

  const addImage = (imagePath: string) => {
    if (!testimony || testimony.images?.includes(imagePath)) return;
    updateField('images', [...(testimony.images || []), imagePath]);
  };

  const removeImage = (imagePath: string) => {
    if (!testimony) return;
    updateField('images', (testimony.images || []).filter(img => img !== imagePath));
  };

  const handleImageSelect = (image: { path: string }) => {
    addImage(image.path);
    setShowMediaGallery(false);
  };

  const linkPageBasedImage = (imagePath: string) => {
    if (!testimony || testimony.images?.includes(imagePath)) return;
    updateField('images', [...(testimony.images || []), imagePath]);
  };

  const unlinkPageBasedImage = (imagePath: string) => {
    if (!testimony) return;
    updateField('images', (testimony.images || []).filter(img => img !== imagePath));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Failed to load testimony</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNew ? 'Create New Testimonial' : 'Edit Testimonial'}
              </h1>
              {!isNew && (
                <p className="text-gray-600">ID: {testimony.id}</p>
              )}
            </div>
            <button
              onClick={() => router.push('/admin/testimonials')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-600">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-green-600">{success}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID *
                </label>
                <input
                  type="text"
                  value={testimony.id}
                  onChange={(e) => updateField('id', e.target.value)}
                  required
                  disabled={!isNew}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-black"
                  placeholder="unique-identifier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Number *
                </label>
                <input
                  type="number"
                  value={testimony.page}
                  onChange={(e) => updateField('page', parseInt(e.target.value) || 0)}
                  required
                  min={metadata?.pageRange.min || 1}
                  max={metadata?.pageRange.max || 143}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
            </div>

            {/* Page Range (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Range (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                If this testimonial spans multiple pages, specify the range to load all relevant images.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Page</label>
                  <input
                    type="number"
                    value={testimony.pageRange?.start || testimony.page}
                    onChange={(e) => updateField('pageRange', {
                      start: parseInt(e.target.value) || testimony.page,
                      end: testimony.pageRange?.end || testimony.page
                    })}
                    min={metadata?.pageRange.min || 1}
                    max={metadata?.pageRange.max || 143}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Page</label>
                  <input
                    type="number"
                    value={testimony.pageRange?.end || testimony.page}
                    onChange={(e) => updateField('pageRange', {
                      start: testimony.pageRange?.start || testimony.page,
                      end: parseInt(e.target.value) || testimony.page
                    })}
                    min={testimony.pageRange?.start || testimony.page}
                    max={metadata?.pageRange.max || 143}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={testimony.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Testimony title"
              />
            </div>

            {/* Author and Relationship Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={testimony.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  required
                  list="authors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Author name"
                />
                <datalist id="authors">
                  {metadata?.authors.map(author => (
                    <option key={author} value={author} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <input
                  type="text"
                  value={testimony.relationship}
                  onChange={(e) => updateField('relationship', e.target.value)}
                  required
                  list="relationships"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Relationship to Tony"
                />
                <datalist id="relationships">
                  {metadata?.relationships.map(rel => (
                    <option key={rel} value={rel} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Category and Chapter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={testimony.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  {metadata?.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter *
                </label>
                <select
                  value={testimony.chapter}
                  onChange={(e) => updateField('chapter', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  <option value="">Select Chapter</option>
                  {metadata?.chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {testimony.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  list="tags"
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <datalist id="tags">
                  {metadata?.tags.map(tag => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={testimony.content}
                onChange={(value) => updateField('content', value)}
                placeholder="Enter the testimonial content..."
              />
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">Auto</span>
                    <span className="text-gray-500">Page-based</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">Manual</span>
                    <span className="text-gray-500">Manually added</span>
                  </div>
                </div>
              </div>
              
              {/* Selected Images */}
              {testimony.images && testimony.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-black mb-2">Selected Images ({testimony.images.length}):</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {testimony.images.map((imagePath, index) => {
                      // Check if this is a page-based image
                      const pageBasedImage = pageBasedImages.find(img => img.path === imagePath);
                      const isPageBased = !!pageBasedImage;
                      
                      return (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <div className="aspect-square relative">
                            <Image
                              src={imagePath}
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(imagePath)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                          
                          {/* Source indicator */}
                          <div className="absolute top-1 left-1">
                            <span className={`inline-flex items-center px-1 py-0.5 text-xs font-medium rounded ${
                              isPageBased 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isPageBased ? 'Auto' : 'Manual'}
                            </span>
                          </div>
                          
                          <div className="p-2 bg-white">
                            <div className="text-xs text-black truncate mb-1">
                              {isPageBased ? pageBasedImage.sectionTitle : imagePath.split('/').pop()}
                            </div>
                            {isPageBased && pageBasedImage.photoNumber && (
                              <div className="text-xs text-gray-500 mb-1">Photo #{pageBasedImage.photoNumber}</div>
                            )}
                            <div className="mt-1">
                              <input
                                type="text"
                                value={testimony.imagesCaptions?.[imagePath] || ''}
                                onChange={(e) => updateImageCaption(imagePath, e.target.value)}
                                placeholder="Custom caption (optional)"
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300 text-black"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Add Images Button */}
              <button
                type="button"
                onClick={() => setShowMediaGallery(true)}
                className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Images</span>
              </button>
            </div>

            {/* Page-Based Images */}
            {pageBasedImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page-Based Images for {testimony.pageRange && testimony.pageRange.start !== testimony.pageRange.end 
                    ? `Pages ${testimony.pageRange.start}-${testimony.pageRange.end}` 
                    : `Page ${testimony.page}`}
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  These images follow the naming convention and are automatically associated with this page. 
                  You can link or unlink them from this testimonial.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pageBasedImages.map((image, index) => {
                    const isLinked = testimony.images?.includes(image.path);
                    return (
                      <div key={index} className="relative border rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            src={image.path}
                            alt={image.title || `Page ${image.page} image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        
                        {/* Link/Unlink Button */}
                        <button
                          type="button"
                          onClick={() => isLinked ? unlinkPageBasedImage(image.path) : linkPageBasedImage(image.path)}
                          className={`absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${
                            isLinked 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-gray-500 text-white hover:bg-gray-600'
                          }`}
                          title={isLinked ? 'Unlink from testimonial' : 'Link to testimonial'}
                        >
                          {isLinked ? '✓' : '+'}
                        </button>
                        
                        {/* Auto indicator */}
                        <div className="absolute top-1 left-1">
                          <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                            Auto
                          </span>
                        </div>
                        
                        <div className="p-2 bg-white">
                          <div className="text-xs text-black font-medium truncate">
                            {image.sectionTitle || image.filename}
                          </div>
                          {image.photoNumber && (
                            <div className="text-xs text-gray-500">Photo #{image.photoNumber}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/testimonials')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : (isNew ? 'Create Testimony' : 'Update Testimony')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-full overflow-hidden w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-black">Select Images for Testimonial</h3>
              <button
                onClick={() => setShowMediaGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-96 overflow-auto">
              <MediaGallery
                onSelectImage={handleImageSelect}
                selectedImages={testimony.images || []}
                mode="select"
                testimonyPage={testimony.page}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}