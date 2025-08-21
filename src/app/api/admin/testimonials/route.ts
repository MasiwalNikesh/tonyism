import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

const TESTIMONIES_FILE = path.join(process.cwd(), 'src/data/testimonies.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  // Simple password-based auth - in production, use proper JWT or session management
  return token === 'admin123'; // Change this to a secure password
}

async function createBackup(): Promise<void> {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `testimonies-${timestamp}.json`);
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    await fs.writeFile(backupFile, data);
  } catch (error) {
    console.error('Failed to create backup:', error);
  }
}

// GET /api/admin/testimonials - Get all testimonials with pagination and search
export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const chapter = url.searchParams.get('chapter') || '';
    
    let filtered = testimonials;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }
    
    // Apply chapter filter
    if (chapter) {
      filtered = filtered.filter(t => t.chapter === chapter);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    return NextResponse.json({
      testimonials: paginatedResults,
      pagination: {
        current: page,
        total: Math.ceil(filtered.length / limit),
        totalItems: filtered.length,
        hasNext: endIndex < filtered.length,
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
    
    // Check if we're in production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    if (isProduction) {
      // In production, return a mock success response since file system is read-only
      console.log('Production environment detected - testimony creation simulated');
      console.log('New testimony data:', JSON.stringify(newTestimony, null, 2));
      return NextResponse.json({ 
        message: 'Testimony creation received (production mode)', 
        testimony: newTestimony,
        note: 'File system updates are disabled in production environment'
      });
    }
    
    // Development environment - proceed with file operations
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    // Check for duplicate ID
    if (testimonials.some(t => t.id === newTestimony.id)) {
      return NextResponse.json({ error: 'Testimony with this ID already exists' }, { status: 409 });
    }
    
    // Create backup before modification (only in development)
    await createBackup();
    
    testimonials.push(newTestimony);
    await fs.writeFile(TESTIMONIES_FILE, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json({ message: 'Testimony created successfully', testimony: newTestimony });
  } catch (error) {
    console.error('Error creating testimony:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to create testimony', 
      details: errorMessage,
      environment: process.env.NODE_ENV || 'unknown'
    }, { status: 500 });
  }
}