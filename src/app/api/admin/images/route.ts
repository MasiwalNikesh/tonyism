import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  return token === 'admin123';
}

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

// GET /api/admin/images - Get all testimony images
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const imagesDir = path.join(process.cwd(), 'public/images/testimonies');
    const files = await fs.readdir(imagesDir);
    
    // Filter for image files and extract metadata from filenames
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    const images: TestimonyImage[] = [];
    
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);
      
      // Parse filename for page number and metadata (format: "PageNumber_SectionTitle_SectionPageNumber_PhotoNumber.ext")
      const match = file.match(/^(\d+)_(.+?)_(\d+)_(\d+)\.(jpg|jpeg|png|gif|webp)$/i);
      
      let page: number | undefined;
      let title: string | undefined;
      let author: string | undefined;
      let isPageBased = false;
      let sectionTitle: string | undefined;
      let sectionPage: number | undefined;
      let photoNumber: number | undefined;
      
      if (match) {
        page = parseInt(match[1]);
        sectionTitle = match[2].replace(/_/g, ' ');
        sectionPage = parseInt(match[3]);
        photoNumber = parseInt(match[4]);
        title = sectionTitle;
        isPageBased = true;
        
        // Try to extract author from title if it contains author info
        const titleParts = sectionTitle.split(' ');
        if (titleParts.length > 3) {
          // Assume last parts might be author name
          author = titleParts.slice(-2).join(' ');
          title = titleParts.slice(0, -2).join(' ');
        }
      }
      
      images.push({
        filename: file,
        path: `/images/testimonies/${file}`,
        page,
        title,
        author,
        size: stats.size,
        lastModified: stats.mtime,
        isPageBased,
        sectionTitle,
        sectionPage,
        photoNumber
      });
    }
    
    // Sort by page number, then by filename
    images.sort((a, b) => {
      if (a.page && b.page) {
        if (a.page !== b.page) return a.page - b.page;
      }
      return a.filename.localeCompare(b.filename);
    });
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const pageFilter = url.searchParams.get('pageNumber');
    const search = url.searchParams.get('search') || '';
    
    let filtered = images;
    
    // Apply page filter
    if (pageFilter) {
      const pageNum = parseInt(pageFilter);
      filtered = filtered.filter(img => img.page === pageNum);
    }
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(search.toLowerCase()) ||
        img.title?.toLowerCase().includes(search.toLowerCase()) ||
        img.author?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    return NextResponse.json({
      images: paginatedResults,
      pagination: {
        current: page,
        total: Math.ceil(filtered.length / limit),
        totalItems: filtered.length,
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1
      },
      totalImages: images.length
    });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}