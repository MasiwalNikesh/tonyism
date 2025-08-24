import { db, videos, testimonyVideos } from '../src/lib/db';

async function addVideos() {
  try {
    console.log('Adding videos to testimonies...');
    
    // Add YouTube video for Page 61 (Mohan Masiwal testimony)
    const [youtubeVideo] = await db
      .insert(videos)
      .values({
        url: 'https://youtu.be/SwR8_pRxfE0',
        type: 'youtube',
        title: 'तुमने ज़िन्दगी को खूबसूरत बनाया - Video Tribute',
        description: 'Video testimony by Mohan Masiwal'
      })
      .returning();
    
    console.log('✅ Added YouTube video:', youtubeVideo.id);
    
    // Associate with Page 61 testimony (shukriya-hamari-zindagi-mein)
    await db.insert(testimonyVideos).values({
      testimonyId: 'shukriya-hamari-zindagi-mein',
      videoId: youtubeVideo.id,
      caption: 'Video testimony by Mohan Masiwal',
      order: 1
    });
    
    console.log('✅ Associated YouTube video with Page 61 testimony');
    
    // Add Google Drive video for Page 59 (Sanjay Vasist testimony)
    const [googleDriveVideo] = await db
      .insert(videos)
      .values({
        url: 'https://drive.google.com/file/d/1qYIebR4lCMueQ1kpUxFt_igY3m1-Mcte/view',
        type: 'google_drive',
        title: 'A Rare Soul - Video Tribute',
        description: 'Video testimony by Sanjay Vasist'
      })
      .returning();
    
    console.log('✅ Added Google Drive video:', googleDriveVideo.id);
    
    // Associate with Page 59 testimony (rare-soul)
    await db.insert(testimonyVideos).values({
      testimonyId: 'rare-soul',
      videoId: googleDriveVideo.id,
      caption: 'Video testimony by Sanjay Vasist',
      order: 1
    });
    
    console.log('✅ Associated Google Drive video with Page 59 testimony');
    
    console.log('🎉 Successfully added videos to testimonies!');
    
  } catch (error) {
    console.error('❌ Error adding videos:', error);
    throw error;
  }
}

// Run the script
addVideos().catch(console.error);