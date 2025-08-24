"use client";

import React from 'react';
import { Video } from '@/lib/search';
import { Play, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
  caption?: string;
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

export default function VideoPlayer({ video, caption, className = '' }: VideoPlayerProps) {
  const renderVideo = () => {
    if (video.type === 'youtube') {
      const videoId = getYouTubeVideoId(video.url);
      if (videoId) {
        return (
          <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title || 'YouTube Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        );
      }
    } else if (video.type === 'google_drive') {
      const fileId = getGoogleDriveFileId(video.url);
      if (fileId) {
        return (
          <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://drive.google.com/file/d/${fileId}/preview`}
              title={video.title || 'Google Drive Video'}
              frameBorder="0"
              allow="autoplay"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        );
      }
    }
    
    // Fallback for unsupported or malformed URLs
    return (
      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <Play className="mx-auto mb-3 text-gray-400" size={48} />
          <p className="text-gray-600 mb-3">
            {video.title || 'Video Content'}
          </p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ExternalLink size={16} />
            Open Video
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {renderVideo()}
      
      {/* Video Title */}
      {video.title && (
        <h4 className="mt-3 text-lg font-serif font-semibold text-gray-800">
          {video.title}
        </h4>
      )}
      
      {/* Video Description */}
      {video.description && (
        <p className="mt-2 text-gray-600 text-sm">
          {video.description}
        </p>
      )}
      
      {/* Custom Caption */}
      {caption && (
        <p className="mt-2 text-gray-700 italic text-sm">
          {caption}
        </p>
      )}
      
      {/* Video Duration */}
      {video.duration && (
        <p className="mt-1 text-xs text-gray-500">
          Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </p>
      )}
    </div>
  );
}