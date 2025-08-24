import { db, videos, testimonyVideos } from '../src/lib/db';
import { eq, sql } from 'drizzle-orm';

async function addVideos() {
  try {
    console.log('Starting to add videos to testimonies...');

    // Check if tables exist by trying to run a simple query
    try {
      await db.select().from(videos).limit(1);
      console.log('Video tables already exist');
    } catch (error) {
      console.log('Creating video tables...');
      // Run the migration SQL directly
      const migrationSQL = `
        CREATE TABLE IF NOT EXISTS "videos" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "url" text NOT NULL,
          "type" text NOT NULL,
          "title" text,
          "description" text,
          "thumbnail_url" text,
          "duration" integer,
          "created_at" timestamp DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS "testimony_videos" (
          "testimony_id" text,
          "video_id" uuid,
          "caption" text,
          "order" integer DEFAULT 0,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "testimony_videos_testimony_id_video_id_pk" PRIMARY KEY("testimony_id","video_id")
        );

        DO $$ BEGIN
        ALTER TABLE "testimony_videos" ADD CONSTRAINT "testimony_videos_testimony_id_testimonies_id_fk" FOREIGN KEY ("testimony_id") REFERENCES "testimonies"("id") ON DELETE cascade ON UPDATE no action;
        EXCEPTION
        WHEN duplicate_object THEN null;
        END $$;

        DO $$ BEGIN
        ALTER TABLE "testimony_videos" ADD CONSTRAINT "testimony_videos_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE cascade ON UPDATE no action;
        EXCEPTION
        WHEN duplicate_object THEN null;
        END $$;
      `;

      // Split and execute each statement
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(sql`${statement}`);
        }
      }
      console.log('Video tables created successfully');
    }

    // Add YouTube video for Page 61 (Mohan Masiwal testimony)
    const youtubeVideoData = {
      url: 'https://youtu.be/SwR8_pRxfE0',
      type: 'youtube',
      title: 'तुमने ज़िन्दगी को खूबसूरत बनाया - Video Tribute',
      description: 'Video testimony by Mohan Masiwal'
    };

    const [youtubeVideo] = await db
      .insert(videos)
      .values(youtubeVideoData)
      .returning();

    console.log('Added YouTube video:', youtubeVideo.id);

    // Associate with Page 61 testimony (shukriya-hamari-zindagi-mein)
    await db.insert(testimonyVideos).values({
      testimonyId: 'shukriya-hamari-zindagi-mein',
      videoId: youtubeVideo.id,
      caption: 'Video testimony by Mohan Masiwal',
      order: 1
    });

    console.log('Associated YouTube video with Page 61 testimony');

    // Add Google Drive video for Page 59 (Sanjay Vasist testimony)  
    const googleDriveVideoData = {
      url: 'https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view',
      type: 'google_drive',
      title: 'A Rare Soul - Video Tribute',
      description: 'Video testimony by Sanjay Vasist'
    };

    const [googleDriveVideo] = await db
      .insert(videos)
      .values(googleDriveVideoData)
      .returning();

    console.log('Added Google Drive video:', googleDriveVideo.id);

    // Associate with Page 59 testimony (rare-soul)
    await db.insert(testimonyVideos).values({
      testimonyId: 'rare-soul',
      videoId: googleDriveVideo.id,
      caption: 'Video testimony by Sanjay Vasist', 
      order: 1
    });

    console.log('Associated Google Drive video with Page 59 testimony');

    console.log('✅ Successfully added videos to testimonies!');
  } catch (error) {
    console.error('❌ Error adding videos:', error);
    throw error;
  }
}

// Run the script
addVideos().catch(console.error);