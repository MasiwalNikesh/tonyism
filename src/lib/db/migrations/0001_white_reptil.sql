CREATE TABLE "testimony_videos" (
	"testimony_id" text,
	"video_id" uuid,
	"caption" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "testimony_videos_testimony_id_video_id_pk" PRIMARY KEY("testimony_id","video_id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"description" text,
	"thumbnail_url" text,
	"duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "testimony_videos" ADD CONSTRAINT "testimony_videos_testimony_id_testimonies_id_fk" FOREIGN KEY ("testimony_id") REFERENCES "public"."testimonies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimony_videos" ADD CONSTRAINT "testimony_videos_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;