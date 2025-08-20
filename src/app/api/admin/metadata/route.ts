import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Testimony } from '../testimonials/route';

const TESTIMONIES_FILE = path.join(process.cwd(), 'src/data/testimonies.json');

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  return token === 'admin123';
}

// GET /api/admin/metadata - Get metadata for dropdowns
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    // Extract unique values for dropdown options
    const categories = [...new Set(testimonials.map(t => t.category))].sort();
    const chapters = [...new Set(testimonials.map(t => t.chapter))].sort();
    const relationships = [...new Set(testimonials.map(t => t.relationship))].sort();
    const authors = [...new Set(testimonials.map(t => t.author))].sort();
    
    // Get all unique tags
    const allTags = testimonials.reduce((acc, t) => {
      t.tags.forEach(tag => acc.add(tag));
      return acc;
    }, new Set<string>());
    const tags = Array.from(allTags).sort();
    
    // Get page range
    const pages = testimonials.map(t => t.page).filter(p => p > 0).sort((a, b) => a - b);
    const pageRange = pages.length > 0 ? { min: pages[0], max: pages[pages.length - 1] } : { min: 1, max: 143 };
    
    return NextResponse.json({
      categories,
      chapters,
      relationships,
      authors,
      tags,
      pageRange,
      totalTestimonials: testimonials.length
    });
  } catch (error) {
    console.error('Error reading metadata:', error);
    return NextResponse.json({ error: 'Failed to read metadata' }, { status: 500 });
  }
}