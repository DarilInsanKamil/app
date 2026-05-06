CREATE TYPE "public"."metode_bayar" AS ENUM('dp', 'lunas');--> statement-breakpoint
ALTER TABLE "pembayaran" ADD COLUMN "metode_bayar" "metode_bayar" DEFAULT 'lunas' NOT NULL;