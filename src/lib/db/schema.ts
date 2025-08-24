import { pgTable, text, integer, jsonb, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';

// Testimonies table
export const testimonies = pgTable('testimonies', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  relationship: text('relationship').notNull(),
  content: text('content').notNull(),
  page: integer('page').notNull(),
  category: text('category').notNull(),
  chapter: text('chapter').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  pageRange: jsonb('page_range').$type<{start: number; end: number}>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Images table for storing image metadata
export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  path: text('path').notNull().unique(),
  filename: text('filename').notNull(),
  page: integer('page'),
  title: text('title'),
  author: text('author'),
  size: integer('size'),
  lastModified: timestamp('last_modified'),
  isPageBased: integer('is_page_based').default(0), // 0 = false, 1 = true (SQLite style)
  sectionTitle: text('section_title'),
  sectionPage: integer('section_page'),
  photoNumber: integer('photo_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for testimony-image relationships with captions
export const testimonyImages = pgTable('testimony_images', {
  testimonyId: text('testimony_id').references(() => testimonies.id, { onDelete: 'cascade' }),
  imageId: uuid('image_id').references(() => images.id, { onDelete: 'cascade' }),
  caption: text('caption'), // Custom caption for this specific image in this testimony
  order: integer('order').default(0), // For ordering images within a testimony
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.testimonyId, table.imageId] }),
}));

// Videos table for storing video metadata
export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  type: text('type').notNull(), // 'youtube', 'google_drive', 'vimeo', etc.
  title: text('title'),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // in seconds
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for testimony-video relationships
export const testimonyVideos = pgTable('testimony_videos', {
  testimonyId: text('testimony_id').references(() => testimonies.id, { onDelete: 'cascade' }),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'cascade' }),
  caption: text('caption'), // Custom caption for this specific video in this testimony
  order: integer('order').default(0), // For ordering videos within a testimony
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.testimonyId, table.videoId] }),
}));

// Types for TypeScript
export type Testimony = typeof testimonies.$inferSelect;
export type NewTestimony = typeof testimonies.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type TestimonyImage = typeof testimonyImages.$inferSelect;
export type NewTestimonyImage = typeof testimonyImages.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
export type TestimonyVideo = typeof testimonyVideos.$inferSelect;
export type NewTestimonyVideo = typeof testimonyVideos.$inferInsert;