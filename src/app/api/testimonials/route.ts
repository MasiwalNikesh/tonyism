import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm';
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

// GET /api/testimonials - Get all testimonials for public use
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id) {
      // Get single testimony by ID
      const testimonyResult = await db
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
        .where(eq(testimonies.id, id))
        .limit(1);
      
      if (testimonyResult.length === 0) {
        return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
      }
      
      const testimony = testimonyResult[0];
      
      // Get associated images
      const testimonyImagesResult = await db
        .select({
          imagePath: images.path,
          caption: testimonyImages.caption,
          order: testimonyImages.order,
        })
        .from(testimonyImages)
        .innerJoin(images, eq(testimonyImages.imageId, images.id))
        .where(eq(testimonyImages.testimonyId, id))
        .orderBy(testimonyImages.order);
      
      // Format the response
      const formattedTestimony: Testimony = {
        ...testimony,
        tags: testimony.tags as string[] || [],
        pageRange: testimony.pageRange as { start: number; end: number } | undefined,
        images: testimonyImagesResult.map(img => img.imagePath),
        imagesCaptions: testimonyImagesResult.reduce((acc, img) => {
          if (img.caption) {
            acc[img.imagePath] = img.caption;
          }
          return acc;
        }, {} as { [imagePath: string]: string }),
      };
      
      return NextResponse.json(formattedTestimony);
    } else {
      // Get all testimonials
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
        .orderBy(testimonies.page);
      
      // Get images for all testimonials
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
      
      return NextResponse.json(formattedTestimonies);
    }
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json({ error: 'Failed to read testimonials' }, { status: 500 });
  }
}