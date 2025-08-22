CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"filename" text NOT NULL,
	"page" integer,
	"title" text,
	"author" text,
	"size" integer,
	"last_modified" timestamp,
	"is_page_based" integer DEFAULT 0,
	"section_title" text,
	"section_page" integer,
	"photo_number" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "images_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "testimonies" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"relationship" text NOT NULL,
	"content" text NOT NULL,
	"page" integer NOT NULL,
	"category" text NOT NULL,
	"chapter" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"page_range" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimony_images" (
	"testimony_id" text,
	"image_id" uuid,
	"caption" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "testimony_images_testimony_id_image_id_pk" PRIMARY KEY("testimony_id","image_id")
);
--> statement-breakpoint
ALTER TABLE "testimony_images" ADD CONSTRAINT "testimony_images_testimony_id_testimonies_id_fk" FOREIGN KEY ("testimony_id") REFERENCES "public"."testimonies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimony_images" ADD CONSTRAINT "testimony_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;