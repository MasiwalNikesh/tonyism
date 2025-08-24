import { db, videos, testimonyVideos } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function createTablesAndAddVideos() {
  try {
    console.log('Creating tables and adding videos...');
    
    // Create videos table
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "videos" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "url" text NOT NULL,
          "type" text NOT NULL,
          "title" text,
          "description" text,
          "thumbnail_url" text,
          "duration" integer,
          "created_at" timestamp DEFAULT now()
        )
      `);
      console.log('✅ Videos table created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ Videos table already exists');
      } else {
        throw error;
      }
    }
    
    // Create testimony_videos table
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "testimony_videos" (
          "testimony_id" text,
          "video_id" uuid,
          "caption" text,
          "order" integer DEFAULT 0,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "testimony_videos_testimony_id_video_id_pk" PRIMARY KEY("testimony_id","video_id")
        )
      `);
      console.log('✅ Testimony videos table created');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ Testimony videos table already exists');
      } else {
        throw error;
      }
    }
    
    // Add foreign key constraints
    try {
      await db.execute(sql`
        ALTER TABLE "testimony_videos" 
        ADD CONSTRAINT "testimony_videos_testimony_id_testimonies_id_fk" 
        FOREIGN KEY ("testimony_id") REFERENCES "testimonies"("id") ON DELETE cascade ON UPDATE no action
      `);
      console.log('✅ Added testimony foreign key constraint');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ Testimony foreign key constraint already exists');
      } else {
        console.log('⚠️ Could not add testimony foreign key constraint:', error.message);
      }
    }
    
    try {
      await db.execute(sql`
        ALTER TABLE "testimony_videos" 
        ADD CONSTRAINT "testimony_videos_video_id_videos_id_fk" 
        FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE cascade ON UPDATE no action
      `);
      console.log('✅ Added video foreign key constraint');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ Video foreign key constraint already exists');
      } else {
        console.log('⚠️ Could not add video foreign key constraint:', error.message);
      }
    }
    
    // Add YouTube video for Page 61 (Mohan Masiwal testimony)
    const youtubeVideoResult = await db.execute(sql`
      INSERT INTO videos (url, type, title, description) 
      VALUES (${sql.raw("'https://youtu.be/SwR8_pRxfE0'")}, ${sql.raw("'youtube'")}, 
              ${sql.raw("'तुमने ज़िन्दगी को खूबसूरत बनाया - Video Tribute'")}, 
              ${sql.raw("'Video testimony by Mohan Masiwal'")}) 
      ON CONFLICT (url) DO UPDATE SET url = EXCLUDED.url
      RETURNING id
    `);
    
    const youtubeVideoId = youtubeVideoResult.rows[0]?.id;
    if (youtubeVideoId) {
      console.log('✅ YouTube video added/found:', youtubeVideoId);
      
      // Associate with Page 61 testimony
      await db.execute(sql`
        INSERT INTO testimony_videos (testimony_id, video_id, caption, "order") 
        VALUES (${sql.raw("'shukriya-hamari-zindagi-mein'")}, ${youtubeVideoId}, 
                ${sql.raw("'Video testimony by Mohan Masiwal'")}, 1)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Associated YouTube video with Page 61 testimony');
    }
    
    // Add Google Drive video for Page 59 (Sanjay Vasist testimony)
    const googleDriveVideoResult = await db.execute(sql`
      INSERT INTO videos (url, type, title, description) 
      VALUES (${sql.raw("'https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view'")}, 
              ${sql.raw("'google_drive'")},
              ${sql.raw("'A Rare Soul - Video Tribute'")}, 
              ${sql.raw("'Video testimony by Sanjay Vasist'")}) 
      ON CONFLICT (url) DO UPDATE SET url = EXCLUDED.url
      RETURNING id
    `);
    
    const googleDriveVideoId = googleDriveVideoResult.rows[0]?.id;
    if (googleDriveVideoId) {
      console.log('✅ Google Drive video added/found:', googleDriveVideoId);
      
      // Associate with Page 59 testimony
      await db.execute(sql`
        INSERT INTO testimony_videos (testimony_id, video_id, caption, "order") 
        VALUES (${sql.raw("'rare-soul'")}, ${googleDriveVideoId}, 
                ${sql.raw("'Video testimony by Sanjay Vasist'")}, 1)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Associated Google Drive video with Page 59 testimony');
    }
    
    console.log('🎉 Successfully created tables and added videos!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run the script
createTablesAndAddVideos().catch(console.error);