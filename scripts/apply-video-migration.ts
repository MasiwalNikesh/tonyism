import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
  try {
    console.log('Applying video migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../src/lib/db/migrations/0001_white_reptil.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split by statement breakpoint comments and execute each SQL statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('-->'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        try {
          await db.execute(sql.raw(statement));
          console.log('✅ Statement executed successfully');
        } catch (error: any) {
          // Ignore "already exists" errors  
          if (error.message?.includes('already exists') || error.message?.includes('duplicate key')) {
            console.log('⚠️  Statement already applied, skipping...');
          } else {
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Migration applied successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    return false;
  }
}

async function addVideosToTestimonies() {
  try {
    console.log('Adding videos to testimonies...');
    
    // Check if videos table is ready
    const testQuery = await db.execute(sql.raw('SELECT COUNT(*) FROM videos'));
    console.log('Videos table is ready');
    
    // Add YouTube video for Page 61 (Mohan Masiwal testimony)
    const youtubeVideoId = await db.execute({
      sql: `
        INSERT INTO videos (url, type, title, description) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT DO NOTHING 
        RETURNING id
      `,
      params: [
        'https://youtu.be/SwR8_pRxfE0',
        'youtube',
        'तुमने ज़िन्दगी को खूबसूरत बनाया - Video Tribute',
        'Video testimony by Mohan Masiwal'
      ]
    });
    
    let videoId: string;
    if (youtubeVideoId.rows.length > 0) {
      videoId = youtubeVideoId.rows[0].id;
      console.log('Added YouTube video:', videoId);
    } else {
      // Video might already exist, get its ID
      const existingVideo = await db.execute({
        sql: 'SELECT id FROM videos WHERE url = $1',
        params: ['https://youtu.be/SwR8_pRxfE0']
      });
      if (existingVideo.rows.length > 0) {
        videoId = existingVideo.rows[0].id;
        console.log('Using existing YouTube video:', videoId);
      } else {
        throw new Error('Could not create or find YouTube video');
      }
    }
    
    // Associate with Page 61 testimony
    await db.execute({
      sql: `
        INSERT INTO testimony_videos (testimony_id, video_id, caption, "order") 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `,
      params: ['shukriya-hamari-zindagi-mein', videoId, 'Video testimony by Mohan Masiwal', 1]
    });
    console.log('Associated YouTube video with Page 61 testimony');
    
    // Add Google Drive video for Page 59 (Sanjay Vasist testimony)
    const googleDriveVideoId = await db.execute({
      sql: `
        INSERT INTO videos (url, type, title, description) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT DO NOTHING 
        RETURNING id
      `,
      params: [
        'https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view',
        'google_drive',
        'A Rare Soul - Video Tribute',
        'Video testimony by Sanjay Vasist'
      ]
    });
    
    let driveVideoId: string;
    if (googleDriveVideoId.rows.length > 0) {
      driveVideoId = googleDriveVideoId.rows[0].id;
      console.log('Added Google Drive video:', driveVideoId);
    } else {
      // Video might already exist, get its ID
      const existingVideo = await db.execute({
        sql: 'SELECT id FROM videos WHERE url = $1',
        params: ['https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view']
      });
      if (existingVideo.rows.length > 0) {
        driveVideoId = existingVideo.rows[0].id;
        console.log('Using existing Google Drive video:', driveVideoId);
      } else {
        throw new Error('Could not create or find Google Drive video');
      }
    }
    
    // Associate with Page 59 testimony
    await db.execute({
      sql: `
        INSERT INTO testimony_videos (testimony_id, video_id, caption, "order") 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `,
      params: ['rare-soul', driveVideoId, 'Video testimony by Sanjay Vasist', 1]
    });
    console.log('Associated Google Drive video with Page 59 testimony');
    
    console.log('✅ Successfully added videos to testimonies!');
    return true;
  } catch (error) {
    console.error('❌ Error adding videos to testimonies:', error);
    return false;
  }
}

// Run the script
async function main() {
  const migrationSuccess = await applyMigration();
  if (migrationSuccess) {
    await addVideosToTestimonies();
  }
}

main().catch(console.error);