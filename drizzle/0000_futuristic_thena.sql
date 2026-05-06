CREATE TYPE "public"."status_pembayaran" AS ENUM('pending', 'canceled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."status_transaksi" AS ENUM('menunggu_pembayaran', 'dp', 'lunas', 'dibatalkan');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "armada" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"public_image_id" text NOT NULL,
	"nama_armada" text NOT NULL,
	"jumlah_unit" integer DEFAULT 1,
	"plat_nomor" text NOT NULL,
	"kapasitas" integer NOT NULL,
	"deskripsi" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"harga_sewa" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bundle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_bundle" text NOT NULL,
	"image_url" text NOT NULL,
	"public_image_id" text NOT NULL,
	"deskripsi" text,
	"harga_bundle" numeric NOT NULL,
	"jumlah_unit" integer NOT NULL,
	"add_ons" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_lengkap" text NOT NULL,
	"email" text NOT NULL,
	"no_hp" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "customer_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"public_image_id" text NOT NULL,
	"deskripsi" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pembayaran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservasi_id" uuid NOT NULL,
	"order_id" text NOT NULL,
	"amount" numeric NOT NULL,
	"fee" numeric NOT NULL,
	"total_payment" numeric NOT NULL,
	"payment_method" text NOT NULL,
	"payment_number" text,
	"payment_url" text,
	"redirect_url" text,
	"status" "status_pembayaran" DEFAULT 'pending' NOT NULL,
	"expired_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "pembayaran_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "reservasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bundle_id" uuid,
	"armada_id" uuid,
	"jumlah_unit" integer NOT NULL,
	"customer_id" uuid,
	"total_harga" numeric NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date NOT NULL,
	"lokasi_jemput" text,
	"status_transaksi" "status_transaksi" DEFAULT 'menunggu_pembayaran',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "check_bundle_or_armada" CHECK (("reservasi"."bundle_id" IS NOT NULL OR "reservasi"."armada_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "testimoni" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"komentar" text NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'user',
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_reservasi_id_reservasi_id_fk" FOREIGN KEY ("reservasi_id") REFERENCES "public"."reservasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_bundle_id_bundle_id_fk" FOREIGN KEY ("bundle_id") REFERENCES "public"."bundle"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_armada_id_armada_id_fk" FOREIGN KEY ("armada_id") REFERENCES "public"."armada"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_reservasi_customer" ON "reservasi" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_reservasi_status" ON "reservasi" USING btree ("status_transaksi");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");