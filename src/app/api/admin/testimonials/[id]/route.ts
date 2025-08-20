import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Testimony } from '../route';

const TESTIMONIES_FILE = path.join(process.cwd(), 'src/data/testimonies.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Simple admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  return token === 'admin123';
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
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    const testimony = testimonials.find(t => t.id === id);
    if (!testimony) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }
    
    return NextResponse.json(testimony);
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
    
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }
    
    // Create backup before modification
    await createBackup();
    
    // Ensure the ID doesn't change
    updatedTestimony.id = id;
    testimonials[index] = updatedTestimony;
    
    await fs.writeFile(TESTIMONIES_FILE, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json({ message: 'Testimony updated successfully', testimony: updatedTestimony });
  } catch (error) {
    console.error('Error updating testimony:', error);
    return NextResponse.json({ error: 'Failed to update testimony' }, { status: 500 });
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
    const data = await fs.readFile(TESTIMONIES_FILE, 'utf8');
    const testimonials: Testimony[] = JSON.parse(data);
    
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }
    
    // Create backup before modification
    await createBackup();
    
    const deletedTestimony = testimonials.splice(index, 1)[0];
    await fs.writeFile(TESTIMONIES_FILE, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json({ message: 'Testimony deleted successfully', testimony: deletedTestimony });
  } catch (error) {
    console.error('Error deleting testimony:', error);
    return NextResponse.json({ error: 'Failed to delete testimony' }, { status: 500 });
  }
}