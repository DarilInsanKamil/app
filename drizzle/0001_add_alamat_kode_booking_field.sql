ALTER TABLE "customer" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "alamat" text;--> statement-breakpoint
ALTER TABLE "reservasi" ADD COLUMN "kode_booking" text;--> statement-breakpoint
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_kode_booking_unique" UNIQUE("kode_booking");