import { db } from "$lib/server/db";
import { armada, reservasi } from "$lib/server/db/schema";
import { and, gte, lte, ne, notInArray, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({url}) => {
    const tanggalMulai = url.searchParams.get('tanggalMulai')?.toString() ?? ''
    const tanggalSelesai = url.searchParams.get('tanggalSelesai')?.toString() ?? ''
    const availableArmada = await db
      .select()
      .from(armada)
      .where(
        and(
          notInArray(
            armada.id,
            db
              .select({ armadaId: reservasi.armadaId })
              .from(reservasi)
              .where(
                and(
                  ne(reservasi.statusTransaksi, "dibatalkan"),
                  lte(sql`${reservasi.tanggalMulai}::date`, sql`${tanggalSelesai}::date`),
                  gte(sql`${reservasi.tanggalSelesai}::date`, sql`${tanggalMulai}::date`)
                )
              )
          ),
        )
      );
  
    return {
      success: true,
      dataArmada: availableArmada,
      date: {
        tanggalMulai, tanggalSelesai
      }
    }
  }
