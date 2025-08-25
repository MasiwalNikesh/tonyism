import { db, videos, testimonyVideos } from "../src/lib/db";
import { eq, sql, and } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function applyMigration() {
  try {
    console.log("Applying video migration...");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "../src/lib/db/migrations/0001_white_reptil.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by statement breakpoint comments and execute each SQL statement
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("-->"));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log("Executing:", statement.substring(0, 50) + "...");
        try {
          await db.execute(sql.raw(statement));
          console.log("✅ Statement executed successfully");
        } catch (error: any) {
          // Ignore "already exists" errors
          if (
            error.message?.includes("already exists") ||
            error.message?.includes("duplicate key")
          ) {
            console.log("⚠️  Statement already applied, skipping...");
          } else {
            throw error;
          }
        }
      }
    }

    console.log("✅ Migration applied successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    return false;
  }
}

async function addVideosToTestimonies() {
  try {
    console.log("Adding videos to testimonies...");

    // Check if videos table is ready
    const existingVideos = await db.select().from(videos);
    console.log(
      `Videos table is ready. Found ${existingVideos.length} existing videos.`
    );

    // Add YouTube video for Page 61 (Mohan Masiwal testimony)
    console.log("Adding YouTube video for Page 61...");
    const youtubeVideoData = {
      url: "https://youtu.be/SwR8_pRxfE0?feature=shared",
      type: "youtube",
      title: "तुमने ज़िन्दगी को खूबसूरत बनाया - Video Tribute",
      description: "Video testimony by Mohan Masiwal",
    };

    // Check if video already exists
    const existingYouTubeVideo = await db
      .select()
      .from(videos)
      .where(eq(videos.url, youtubeVideoData.url));

    let youtubeVideoId: string;
    if (existingYouTubeVideo.length > 0) {
      youtubeVideoId = existingYouTubeVideo[0].id;
      console.log("YouTube video already exists with ID:", youtubeVideoId);
    } else {
      const [newYouTubeVideo] = await db
        .insert(videos)
        .values(youtubeVideoData)
        .returning();
      youtubeVideoId = newYouTubeVideo.id;
      console.log("Created YouTube video with ID:", youtubeVideoId);
    }

    // Associate with Page 61 testimony
    const existingYouTubeAssociation = await db
      .select()
      .from(testimonyVideos)
      .where(
        and(
          eq(testimonyVideos.testimonyId, "shukriya-hamari-zindagi-mein"),
          eq(testimonyVideos.videoId, youtubeVideoId)
        )
      );

    if (existingYouTubeAssociation.length === 0) {
      await db.insert(testimonyVideos).values({
        testimonyId: "shukriya-hamari-zindagi-mein",
        videoId: youtubeVideoId,
        caption: "Video testimony by Mohan Masiwal",
        order: 1,
      });
      console.log("✅ Associated YouTube video with Page 61 testimony");
    } else {
      console.log("YouTube video already associated with Page 61 testimony");
    }

    // Add Google Drive video for Page 59 (Sanjay Vasist testimony)
    console.log("Adding Google Drive video for Page 59...");
    const driveVideoData = {
      url: "https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view?usp=drivesdk",
      type: "google_drive",
      title: "A Rare Soul - Video Tribute",
      description: "Video testimony by Sanjay Vasist",
    };

    // Check if video already exists
    const existingDriveVideo = await db
      .select()
      .from(videos)
      .where(eq(videos.url, driveVideoData.url));

    let driveVideoId: string;
    if (existingDriveVideo.length > 0) {
      driveVideoId = existingDriveVideo[0].id;
      console.log("Google Drive video already exists with ID:", driveVideoId);
    } else {
      const [newDriveVideo] = await db
        .insert(videos)
        .values(driveVideoData)
        .returning();
      driveVideoId = newDriveVideo.id;
      console.log("Created Google Drive video with ID:", driveVideoId);
    }

    // Associate with Page 59 testimony
    const existingDriveAssociation = await db
      .select()
      .from(testimonyVideos)
      .where(
        and(
          eq(testimonyVideos.testimonyId, "rare-soul"),
          eq(testimonyVideos.videoId, driveVideoId)
        )
      );

    if (existingDriveAssociation.length === 0) {
      await db.insert(testimonyVideos).values({
        testimonyId: "rare-soul",
        videoId: driveVideoId,
        caption: "Video testimony by Sanjay Vasist",
        order: 1,
      });
      console.log("✅ Associated Google Drive video with Page 59 testimony");
    } else {
      console.log(
        "Google Drive video already associated with Page 59 testimony"
      );
    }

    console.log("✅ Successfully added videos to testimonies!");
    return true;
  } catch (error) {
    console.error("❌ Error adding videos to testimonies:", error);
    return false;
  }
}

// Run the script
async function main() {
  // Skip migration since tables already exist
  console.log("Skipping migration - tables already exist");
  await addVideosToTestimonies();
}

main().catch(console.error);
