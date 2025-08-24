import { NextRequest, NextResponse } from "next/server";
import { eq, inArray, or, like, sql, and } from "drizzle-orm";
import {
  db,
  testimonies,
  images,
  testimonyImages,
  videos,
  testimonyVideos,
} from "@/lib/db";

export interface Video {
  id: string;
  url: string;
  type: "youtube" | "google_drive" | "vimeo";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
}

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
  videos?: Video[]; // Array of videos
  pageRange?: {
    start: number;
    end: number;
  };
  imagesCaptions?: { [imagePath: string]: string }; // Custom captions for images
  videosCaptions?: { [videoId: string]: string }; // Custom captions for videos
}

// Retry function for database operations
async function retryDbOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Database operation attempt ${attempt} failed:`, error);

      if (attempt <= maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        console.log(`Retrying database operation (attempt ${attempt + 1})...`);
      }
    }
  }

  throw lastError!;
}

// GET /api/testimonials - Get all testimonials for public use with pagination and caching
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const page = url.searchParams.get("page")
      ? parseInt(url.searchParams.get("page")!)
      : 1;
    const limit = url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit")!)
      : 25;
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");

    // Set cache headers for better performance
    const headers = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes, serve stale for 10 minutes
      "Content-Type": "application/json",
    };

    if (id) {
      // Get single testimony by ID with retry
      const testimonyResult = await retryDbOperation(() =>
        db
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
          .limit(1)
      );

      if (testimonyResult.length === 0) {
        return NextResponse.json(
          { error: "Testimony not found" },
          { status: 404 }
        );
      }

      const testimony = testimonyResult[0];

      // Get associated images with retry
      const testimonyImagesResult = await retryDbOperation(() =>
        db
          .select({
            imagePath: images.path,
            caption: testimonyImages.caption,
            order: testimonyImages.order,
          })
          .from(testimonyImages)
          .innerJoin(images, eq(testimonyImages.imageId, images.id))
          .where(eq(testimonyImages.testimonyId, id))
          .orderBy(testimonyImages.order)
      );

      // Get associated videos with retry (gracefully handle missing tables)
      let testimonyVideosResult: Array<{
        videoId: string;
        videoUrl: string;
        videoType: string;
        videoTitle: string | null;
        videoDescription: string | null;
        videoThumbnailUrl: string | null;
        videoDuration: number | null;
        caption: string | null;
        order: number | null;
      }> = [];

      try {
        testimonyVideosResult = await db
          .select({
            videoId: videos.id,
            videoUrl: videos.url,
            videoType: videos.type,
            videoTitle: videos.title,
            videoDescription: videos.description,
            videoThumbnailUrl: videos.thumbnailUrl,
            videoDuration: videos.duration,
            caption: testimonyVideos.caption,
            order: testimonyVideos.order,
          })
          .from(testimonyVideos)
          .innerJoin(videos, eq(testimonyVideos.videoId, videos.id))
          .where(eq(testimonyVideos.testimonyId, id))
          .orderBy(testimonyVideos.order);
      } catch (error: unknown) {
        // Gracefully handle missing video tables (they might not exist in production yet)
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorCode = (error as { code?: string })?.code;
        const errorCause = (
          error as { cause?: { code?: string; message?: string } }
        )?.cause;

        const isTableMissingError =
          errorMessage?.includes("does not exist") ||
          errorMessage?.includes("relation") ||
          errorCode === "42P01" ||
          errorCause?.code === "42P01" ||
          errorCause?.message?.includes("does not exist");

        if (isTableMissingError) {
          console.log(
            "Video tables not found, skipping video queries for single testimony"
          );
          testimonyVideosResult = [];
        } else {
          throw error;
        }
      }

      // Format the response
      const formattedTestimony: Testimony = {
        ...testimony,
        tags: (testimony.tags as string[]) || [],
        pageRange: testimony.pageRange as
          | { start: number; end: number }
          | undefined,
        images: testimonyImagesResult.map((img) => img.imagePath),
        videos: testimonyVideosResult.map((vid) => ({
          id: vid.videoId,
          url: vid.videoUrl,
          type: vid.videoType as "youtube" | "google_drive" | "vimeo",
          title: vid.videoTitle || undefined,
          description: vid.videoDescription || undefined,
          thumbnailUrl: vid.videoThumbnailUrl || undefined,
          duration: vid.videoDuration || undefined,
        })),
        imagesCaptions: testimonyImagesResult.reduce((acc, img) => {
          if (img.caption) {
            acc[img.imagePath] = img.caption;
          }
          return acc;
        }, {} as { [imagePath: string]: string }),
        videosCaptions: testimonyVideosResult.reduce((acc, vid) => {
          if (vid.caption) {
            acc[vid.videoId] = vid.caption;
          }
          return acc;
        }, {} as { [videoId: string]: string }),
      };

      return NextResponse.json(formattedTestimony, { headers });
    } else {
      // Get paginated testimonials with optional filtering
      const offset = (page - 1) * limit;

      // Execute the main query with retry
      const testimonyResults = await retryDbOperation(() => {
        const baseQuery = db
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
          .from(testimonies);

        // Build the complete query in one go
        let whereCondition = undefined;

        if (category && search) {
          const searchTerm = `%${search}%`;
          whereCondition = and(
            eq(testimonies.category, category),
            or(
              like(testimonies.title, searchTerm),
              like(testimonies.author, searchTerm),
              like(testimonies.content, searchTerm)
            )
          );
        } else if (category) {
          whereCondition = eq(testimonies.category, category);
        } else if (search) {
          const searchTerm = `%${search}%`;
          whereCondition = or(
            like(testimonies.title, searchTerm),
            like(testimonies.author, searchTerm),
            like(testimonies.content, searchTerm)
          );
        }

        if (whereCondition) {
          return baseQuery
            .where(whereCondition)
            .orderBy(testimonies.page)
            .limit(limit)
            .offset(offset);
        } else {
          return baseQuery
            .orderBy(testimonies.page)
            .limit(limit)
            .offset(offset);
        }
      });

      // Get total count for pagination info
      const totalCountResult = await retryDbOperation(() => {
        const countQuery = db
          .select({ count: sql<number>`count(*)` })
          .from(testimonies);

        // Apply the same filters as the main query
        if (category && search) {
          const searchTerm = `%${search}%`;
          const whereCondition = and(
            eq(testimonies.category, category),
            or(
              like(testimonies.title, searchTerm),
              like(testimonies.author, searchTerm),
              like(testimonies.content, searchTerm)
            )
          );
          return countQuery.where(whereCondition);
        } else if (category) {
          return countQuery.where(eq(testimonies.category, category));
        } else if (search) {
          const searchTerm = `%${search}%`;
          const whereCondition = or(
            like(testimonies.title, searchTerm),
            like(testimonies.author, searchTerm),
            like(testimonies.content, searchTerm)
          );
          return countQuery.where(whereCondition);
        } else {
          return countQuery;
        }
      });

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      // Get images and videos for all testimonials
      const testimonyIds = testimonyResults.map((t) => t.id);
      let testimonyImagesResults: Array<{
        testimonyId: string | null;
        imagePath: string;
        caption: string | null;
        order: number | null;
      }> = [];

      let testimonyVideosResults: Array<{
        testimonyId: string | null;
        videoId: string;
        videoUrl: string;
        videoType: string;
        videoTitle: string | null;
        videoDescription: string | null;
        videoThumbnailUrl: string | null;
        videoDuration: number | null;
        caption: string | null;
        order: number | null;
      }> = [];

      if (testimonyIds.length > 0) {
        // Get images
        testimonyImagesResults = await retryDbOperation(() =>
          db
            .select({
              testimonyId: testimonyImages.testimonyId,
              imagePath: images.path,
              caption: testimonyImages.caption,
              order: testimonyImages.order,
            })
            .from(testimonyImages)
            .innerJoin(images, eq(testimonyImages.imageId, images.id))
            .where(inArray(testimonyImages.testimonyId, testimonyIds))
            .orderBy(testimonyImages.order)
        );

        // Get videos (gracefully handle missing tables)
        try {
          testimonyVideosResults = await db
            .select({
              testimonyId: testimonyVideos.testimonyId,
              videoId: videos.id,
              videoUrl: videos.url,
              videoType: videos.type,
              videoTitle: videos.title,
              videoDescription: videos.description,
              videoThumbnailUrl: videos.thumbnailUrl,
              videoDuration: videos.duration,
              caption: testimonyVideos.caption,
              order: testimonyVideos.order,
            })
            .from(testimonyVideos)
            .innerJoin(videos, eq(testimonyVideos.videoId, videos.id))
            .where(inArray(testimonyVideos.testimonyId, testimonyIds))
            .orderBy(testimonyVideos.order);
        } catch (error: unknown) {
          // Gracefully handle missing video tables (they might not exist in production yet)
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          const errorCode = (error as { code?: string })?.code;
          const errorCause = (
            error as { cause?: { code?: string; message?: string } }
          )?.cause;

          const isTableMissingError =
            errorMessage?.includes("does not exist") ||
            errorMessage?.includes("relation") ||
            errorCode === "42P01" ||
            errorCause?.code === "42P01" ||
            errorCause?.message?.includes("does not exist");

          if (isTableMissingError) {
            console.log(
              "Video tables not found, skipping video queries for paginated testimonials"
            );
            testimonyVideosResults = [];
          } else {
            throw error;
          }
        }
      }

      // Group images by testimony
      const testimonyImagesMap = new Map<
        string,
        Array<{ path: string; caption: string | null }>
      >();
      testimonyImagesResults.forEach((result) => {
        if (result.testimonyId) {
          if (!testimonyImagesMap.has(result.testimonyId)) {
            testimonyImagesMap.set(result.testimonyId, []);
          }
          testimonyImagesMap.get(result.testimonyId)!.push({
            path: result.imagePath,
            caption: result.caption,
          });
        }
      });

      // Group videos by testimony
      const testimonyVideosMap = new Map<
        string,
        Array<{
          id: string;
          url: string;
          type: string;
          title: string | null;
          description: string | null;
          thumbnailUrl: string | null;
          duration: number | null;
          caption: string | null;
        }>
      >();

      testimonyVideosResults.forEach((result) => {
        if (result.testimonyId) {
          if (!testimonyVideosMap.has(result.testimonyId)) {
            testimonyVideosMap.set(result.testimonyId, []);
          }
          testimonyVideosMap.get(result.testimonyId)!.push({
            id: result.videoId,
            url: result.videoUrl,
            type: result.videoType,
            title: result.videoTitle,
            description: result.videoDescription,
            thumbnailUrl: result.videoThumbnailUrl,
            duration: result.videoDuration,
            caption: result.caption,
          });
        }
      });

      // Combine testimonies with their images and videos
      const formattedTestimonies: Testimony[] = testimonyResults.map(
        (testimony) => {
          const testimonyImages = testimonyImagesMap.get(testimony.id) || [];
          const testimonyVideos = testimonyVideosMap.get(testimony.id) || [];

          return {
            ...testimony,
            tags: (testimony.tags as string[]) || [],
            pageRange: testimony.pageRange as
              | { start: number; end: number }
              | undefined,
            images: testimonyImages.map((img) => img.path),
            videos: testimonyVideos.map((vid) => ({
              id: vid.id,
              url: vid.url,
              type: vid.type as "youtube" | "google_drive" | "vimeo",
              title: vid.title || undefined,
              description: vid.description || undefined,
              thumbnailUrl: vid.thumbnailUrl || undefined,
              duration: vid.duration || undefined,
            })),
            imagesCaptions: testimonyImages.reduce((acc, img) => {
              if (img.caption) {
                acc[img.path] = img.caption;
              }
              return acc;
            }, {} as { [imagePath: string]: string }),
            videosCaptions: testimonyVideos.reduce((acc, vid) => {
              if (vid.caption) {
                acc[vid.id] = vid.caption;
              }
              return acc;
            }, {} as { [videoId: string]: string }),
          };
        }
      );

      // Return paginated response with metadata
      const response = {
        data: formattedTestimonies,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPreviousPage,
          pageSize: limit,
          totalFetched: formattedTestimonies.length,
        },
      };

      return NextResponse.json(response, { headers });
    }
  } catch (error) {
    console.error("Error reading testimonials:", error);
    return NextResponse.json(
      { error: "Failed to read testimonials" },
      { status: 500 }
    );
  }
}
