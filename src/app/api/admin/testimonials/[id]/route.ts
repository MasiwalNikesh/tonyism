import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, testimonies, images, testimonyImages } from '@/lib/db';
import { Testimony } from '../route';

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  return token === 'admin123';
}

// GET /api/admin/testimonials/[id] - Get specific testimony
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get testimony
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
  } catch (error) {
    console.error('Error reading testimony:', error);
    return NextResponse.json({ error: 'Failed to read testimony' }, { status: 500 });
  }
}

// PUT /api/admin/testimonials/[id] - Update testimony
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedTestimony: Testimony = await request.json();
    
    // Validate required fields
    if (!updatedTestimony.title || !updatedTestimony.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if testimony exists
    const existing = await db
      .select({ id: testimonies.id })
      .from(testimonies)
      .where(eq(testimonies.id, id))
      .limit(1);
      
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }
    
    // Update testimony
    await db.update(testimonies)
      .set({
        title: updatedTestimony.title,
        author: updatedTestimony.author,
        relationship: updatedTestimony.relationship,
        content: updatedTestimony.content,
        page: updatedTestimony.page,
        category: updatedTestimony.category,
        chapter: updatedTestimony.chapter,
        tags: updatedTestimony.tags || [],
        pageRange: updatedTestimony.pageRange || null,
        updatedAt: new Date(),
      })
      .where(eq(testimonies.id, id));
    
    // Delete existing image relationships
    await db.delete(testimonyImages)
      .where(eq(testimonyImages.testimonyId, id));
    
    // Handle images if provided
    if (updatedTestimony.images && updatedTestimony.images.length > 0) {
      for (let i = 0; i < updatedTestimony.images.length; i++) {
        const imagePath = updatedTestimony.images[i];
        
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
        const caption = updatedTestimony.imagesCaptions?.[imagePath] || null;
        await db.insert(testimonyImages).values({
          testimonyId: id,
          imageId,
          caption,
          order: i,
        });
      }
    }
    
    return NextResponse.json({ message: 'Testimony updated successfully', testimony: { ...updatedTestimony, id } });
  } catch (error) {
    console.error('Error updating testimony:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to update testimony', 
      details: errorMessage 
    }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials/[id] - Delete testimony
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if testimony exists
    const existing = await db
      .select({ id: testimonies.id })
      .from(testimonies)
      .where(eq(testimonies.id, id))
      .limit(1);
      
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }
    
    // Delete testimony (cascade will handle testimony_images)
    await db.delete(testimonies)
      .where(eq(testimonies.id, id));
    
    return NextResponse.json({ message: 'Testimony deleted successfully', testimony: { id } });
  } catch (error) {
    console.error('Error deleting testimony:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to delete testimony', 
      details: errorMessage 
    }, { status: 500 });
  }
}