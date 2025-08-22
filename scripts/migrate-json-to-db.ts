import { readFileSync } from 'fs';
import { join } from 'path';
import { db, testimonies, images, testimonyImages } from '../src/lib/db';

interface JsonTestimony {
  id: string;
  title: string;
  author: string;
  relationship: string;
  content: string;
  page: number;
  category: string;
  tags: string[];
  chapter: string;
  images?: string[];
  pageRange?: {
    start: number;
    end: number;
  };
  imagesCaptions?: { [imagePath: string]: string };
}

async function migrateData() {
  try {
    console.log('Starting migration from JSON to database...');
    
    // Read the JSON file
    const jsonPath = join(process.cwd(), 'src/data/testimonies.json');
    const jsonData = readFileSync(jsonPath, 'utf8');
    const jsonTestimonies: JsonTestimony[] = JSON.parse(jsonData);
    
    console.log(`Found ${jsonTestimonies.length} testimonies to migrate`);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(testimonyImages);
    await db.delete(testimonies);
    await db.delete(images);
    
    // Track unique images
    const uniqueImages = new Map<string, string>(); // path -> imageId
    
    // Process each testimony
    for (const testimony of jsonTestimonies) {
      console.log(`Migrating testimony: ${testimony.id}`);
      
      // Insert testimony
      await db.insert(testimonies).values({
        id: testimony.id,
        title: testimony.title,
        author: testimony.author,
        relationship: testimony.relationship,
        content: testimony.content,
        page: testimony.page,
        category: testimony.category,
        chapter: testimony.chapter,
        tags: testimony.tags || [],
        pageRange: testimony.pageRange || null,
      });
      
      // Process images if they exist
      if (testimony.images && testimony.images.length > 0) {
        for (let i = 0; i < testimony.images.length; i++) {
          const imagePath = testimony.images[i];
          let imageId: string;
          
          // Check if this image already exists
          if (uniqueImages.has(imagePath)) {
            imageId = uniqueImages.get(imagePath)!;
          } else {
            // Extract image metadata from path
            const filename = imagePath.split('/').pop() || '';
            const isPageBased = filename.includes('_') && /\d+_/.test(filename);
            
            // Parse page number from filename if page-based
            let pageNumber: number | null = null;
            let sectionTitle: string | null = null;
            let photoNumber: number | null = null;
            
            if (isPageBased) {
              const parts = filename.replace('.png', '').split('_');
              if (parts.length >= 2) {
                pageNumber = parseInt(parts[0]);
                sectionTitle = parts.slice(1, -1).join(' ');
                photoNumber = parseInt(parts[parts.length - 1]);
              }
            }
            
            // Insert image
            const insertedImages = await db.insert(images).values({
              path: imagePath,
              filename,
              page: pageNumber,
              title: sectionTitle,
              isPageBased: isPageBased ? 1 : 0,
              sectionTitle,
              photoNumber,
            }).returning();
            
            const insertedImage = insertedImages[0];
            
            imageId = insertedImage.id;
            uniqueImages.set(imagePath, imageId);
          }
          
          // Link image to testimony
          const caption = testimony.imagesCaptions?.[imagePath] || null;
          await db.insert(testimonyImages).values({
            testimonyId: testimony.id,
            imageId,
            caption,
            order: i,
          });
        }
      }
    }
    
    console.log('Migration completed successfully!');
    console.log(`Migrated ${jsonTestimonies.length} testimonies and ${uniqueImages.size} unique images`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData().then(() => {
  console.log('Migration script finished');
  process.exit(0);
});