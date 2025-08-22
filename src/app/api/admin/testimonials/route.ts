import { NextRequest, NextResponse } from 'next/server';
import { eq, like, and, or, count, inArray } from 'drizzle-orm';
import { db, testimonies, images, testimonyImages } from '@/lib/db';

export interface Testimony {
  id: string;
  title: string;
  author: string;
  relationship: string;
  content: string;
  page: number;
  category: string;
  tags: string[];
  chapter: string;
  images?: string[]; // Array of image paths
  pageRange?: {
    start: number;
    end: number;
  };
  imagesCaptions?: { [imagePath: string]: string }; // Custom captions for images
}

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  return token === 'admin123';
}

// GET /api/admin/testimonials - Get all testimonials with pagination and search
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const chapter = url.searchParams.get('chapter') || '';
    
    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(testimonies.title, `%${search}%`),
          like(testimonies.author, `%${search}%`),
          like(testimonies.content, `%${search}%`)
        )
      );
    }
    
    if (category) {
      conditions.push(eq(testimonies.category, category));
    }
    
    if (chapter) {
      conditions.push(eq(testimonies.chapter, chapter));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(testimonies)
      .where(whereClause);
    
    const totalItems = totalResult[0].count;
    
    // Get paginated results with images
    const offset = (page - 1) * limit;
    const testimonyResults = await db
      .select({
        id: testimonies.id,
        title: testimonies.title,
        author: testimonies.author,
        relationship: testimonies.relationship,
        content: testimonies.content,
        page: testimonies.page,
        category: testimonies.category,
        chapter: testimonies.chapter,
        tags: testimonies.tags,
        pageRange: testimonies.pageRange,
      })
      .from(testimonies)
      .where(whereClause)
      .orderBy(testimonies.page)
      .limit(limit)
      .offset(offset);
    
    // Get images for each testimony
    const testimonyIds = testimonyResults.map(t => t.id);
    let testimonyImagesResults: Array<{
      testimonyId: string | null;
      imagePath: string; 
      caption: string | null;
      order: number | null;
    }> = [];
    
    if (testimonyIds.length > 0) {
      testimonyImagesResults = await db
        .select({
          testimonyId: testimonyImages.testimonyId,
          imagePath: images.path,
          caption: testimonyImages.caption,
          order: testimonyImages.order,
        })
        .from(testimonyImages)
        .innerJoin(images, eq(testimonyImages.imageId, images.id))
        .where(inArray(testimonyImages.testimonyId, testimonyIds))
        .orderBy(testimonyImages.order);
    }
    
    // Group images by testimony
    const testimonyImagesMap = new Map<string, Array<{ path: string; caption: string | null }>>();
    testimonyImagesResults.forEach(result => {
      if (result.testimonyId) {
        if (!testimonyImagesMap.has(result.testimonyId)) {
          testimonyImagesMap.set(result.testimonyId, []);
        }
        testimonyImagesMap.get(result.testimonyId)!.push({
          path: result.imagePath,
          caption: result.caption,
        });
      }
    });
    
    // Combine testimonies with their images
    const formattedTestimonies: Testimony[] = testimonyResults.map(testimony => {
      const testimonyImages = testimonyImagesMap.get(testimony.id) || [];
      
      return {
        ...testimony,
        tags: testimony.tags as string[] || [],
        pageRange: testimony.pageRange as { start: number; end: number } | undefined,
        images: testimonyImages.map(img => img.path),
        imagesCaptions: testimonyImages.reduce((acc, img) => {
          if (img.caption) {
            acc[img.path] = img.caption;
          }
          return acc;
        }, {} as { [imagePath: string]: string }),
      };
    });
    
    return NextResponse.json({
      testimonials: formattedTestimonies,
      pagination: {
        current: page,
        total: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: offset + limit < totalItems,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json({ error: 'Failed to read testimonials' }, { status: 500 });
  }
}

// POST /api/admin/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newTestimony: Testimony = await request.json();
    
    // Validate required fields
    if (!newTestimony.id || !newTestimony.title || !newTestimony.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check for duplicate ID
    const existing = await db
      .select({ id: testimonies.id })
      .from(testimonies)
      .where(eq(testimonies.id, newTestimony.id))
      .limit(1);
      
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Testimony with this ID already exists' }, { status: 409 });
    }
    
    // Insert testimony
    await db.insert(testimonies).values({
      id: newTestimony.id,
      title: newTestimony.title,
      author: newTestimony.author,
      relationship: newTestimony.relationship,
      content: newTestimony.content,
      page: newTestimony.page,
      category: newTestimony.category,
      chapter: newTestimony.chapter,
      tags: newTestimony.tags || [],
      pageRange: newTestimony.pageRange || null,
    });
    
    // Handle images if provided
    if (newTestimony.images && newTestimony.images.length > 0) {
      for (let i = 0; i < newTestimony.images.length; i++) {
        const imagePath = newTestimony.images[i];
        
        // Get or create image
        const imageResult = await db
          .select({ id: images.id })
          .from(images)
          .where(eq(images.path, imagePath))
          .limit(1);
        
        let imageId: string;
        
        if (imageResult.length === 0) {
          // Create new image record
          const filename = imagePath.split('/').pop() || '';
          const newImages = await db.insert(images).values({
            path: imagePath,
            filename,
          }).returning();
          const newImage = newImages[0];
          imageId = newImage.id;
        } else {
          imageId = imageResult[0].id;
        }
        
        // Link image to testimony
        const caption = newTestimony.imagesCaptions?.[imagePath] || null;
        await db.insert(testimonyImages).values({
          testimonyId: newTestimony.id,
          imageId,
          caption,
          order: i,
        });
      }
    }
    
    return NextResponse.json({ message: 'Testimony created successfully', testimony: newTestimony });
  } catch (error) {
    console.error('Error creating testimony:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to create testimony', 
      details: errorMessage 
    }, { status: 500 });
  }
}