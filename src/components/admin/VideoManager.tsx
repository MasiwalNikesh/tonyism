"use client";

import React, { useState } from 'react';
import { Plus, X, ExternalLink, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoData {
  url: string;
  type: string;
  title?: string;
  description?: string;
  caption?: string;
  order: number;
}

interface VideoManagerProps {
  videos: VideoData[];
  onVideosChange: (videos: VideoData[]) => void;
  className?: string;
}

// Extract YouTube video ID from various YouTube URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Extract Google Drive file ID from Google Drive URLs
function getGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Validate and detect video type from URL
function validateAndDetectVideoType(url: string): { isValid: boolean; type: string; error?: string } {
  if (!url.trim()) {
    return { isValid: false, type: '', error: 'URL is required' };
  }

  try {
    new URL(url);
  } catch {
    return { isValid: false, type: '', error: 'Invalid URL format' };
  }

  if (getYouTubeVideoId(url)) {
    return { isValid: true, type: 'youtube' };
  }

  if (getGoogleDriveFileId(url)) {
    return { isValid: true, type: 'google_drive' };
  }

  // For now, we'll accept other URLs but mark them as 'other'
  return { isValid: true, type: 'other' };
}

// Generate thumbnail URL for YouTube videos
function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}

export default function VideoManager({ videos, onVideosChange, className = '' }: VideoManagerProps) {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddVideo = () => {
    const validation = validateAndDetectVideoType(newVideoUrl);
    
    if (!validation.isValid) {
      setUrlError(validation.error || 'Invalid video URL');
      return;
    }

    // Check for duplicate URLs
    if (videos.some(video => video.url === newVideoUrl.trim())) {
      setUrlError('This video has already been added');
      return;
    }

    const newVideo: VideoData = {
      url: newVideoUrl.trim(),
      type: validation.type,
      title: newVideoTitle.trim() || undefined,
      description: newVideoDescription.trim() || undefined,
      caption: '',
      order: videos.length
    };

    onVideosChange([...videos, newVideo]);
    
    // Reset form
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDescription('');
    setUrlError('');
    setShowAddForm(false);
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    // Reorder remaining videos
    const reorderedVideos = updatedVideos.map((video, i) => ({
      ...video,
      order: i
    }));
    onVideosChange(reorderedVideos);
  };

  const handleUpdateVideoCaption = (index: number, caption: string) => {
    const updatedVideos = videos.map((video, i) => 
      i === index ? { ...video, caption } : video
    );
    onVideosChange(updatedVideos);
  };

  const handleMoveVideo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= videos.length) return;

    const updatedVideos = [...videos];
    [updatedVideos[index], updatedVideos[newIndex]] = [updatedVideos[newIndex], updatedVideos[index]];
    
    // Update order values
    const reorderedVideos = updatedVideos.map((video, i) => ({
      ...video,
      order: i
    }));
    
    onVideosChange(reorderedVideos);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Videos
        </label>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Supported: YouTube, Google Drive</span>
        </div>
      </div>

      {/* Existing Videos */}
      {videos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Added Videos ({videos.length}):
          </h4>
          
          {videos.map((video, index) => {
            const thumbnail = getYouTubeThumbnail(video.url);
            
            return (
              <div
                key={index}
                className="relative border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Video Preview */}
                  <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Play size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Video Type Badge */}
                    <div className="absolute top-1 left-1">
                      <span className={cn(
                        "inline-flex items-center px-1 py-0.5 text-xs font-medium rounded",
                        video.type === 'youtube' && "bg-red-100 text-red-800",
                        video.type === 'google_drive' && "bg-blue-100 text-blue-800",
                        video.type === 'other' && "bg-gray-100 text-gray-800"
                      )}>
                        {video.type === 'youtube' ? 'YouTube' : 
                         video.type === 'google_drive' ? 'Drive' : 'Other'}
                      </span>
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {video.title || 'Untitled Video'}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-1">
                            {video.url}
                          </div>
                          {video.description && (
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {video.description}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {/* Move buttons */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveVideo(index, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < videos.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveVideo(index, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          
                          {/* External link */}
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Open video"
                          >
                            <ExternalLink size={14} />
                          </a>
                          
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Remove video"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Caption Input */}
                    <div>
                      <input
                        type="text"
                        value={video.caption || ''}
                        onChange={(e) => handleUpdateVideoCaption(index, e.target.value)}
                        placeholder="Add a custom caption for this video (optional)"
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300 text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Video */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Add Video</span>
        </button>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Add New Video</h4>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewVideoUrl('');
                setNewVideoTitle('');
                setNewVideoDescription('');
                setUrlError('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Video URL *
            </label>
            <input
              type="url"
              value={newVideoUrl}
              onChange={(e) => {
                setNewVideoUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 text-black",
                urlError ? "border-red-300" : "border-gray-300"
              )}
            />
            {urlError && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle size={12} />
                {urlError}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Supports: YouTube (youtube.com, youtu.be), Google Drive links
            </div>
          </div>

          {/* Video Title (Optional) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Title (Optional)
            </label>
            <input
              type="text"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              placeholder="Custom title for this video"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 text-black"
            />
          </div>

          {/* Video Description (Optional) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newVideoDescription}
              onChange={(e) => setNewVideoDescription(e.target.value)}
              placeholder="Brief description of the video content"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none text-black"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddVideo}
              disabled={!newVideoUrl.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Video
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewVideoUrl('');
                setNewVideoTitle('');
                setNewVideoDescription('');
                setUrlError('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {videos.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-4">
          No videos added yet. Add YouTube or Google Drive video links to display them on the testimony detail page.
        </p>
      )}
    </div>
  );
}