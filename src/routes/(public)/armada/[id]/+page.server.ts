import { db } from "$lib/server/db";
import { eq, ne } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { armada, reservasi } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { count } from "drizzle-orm";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export const load: PageServerLoad = async ({ params, url }) => {

  const tglMulai = url.searchParams.get('tanggalMulai')?.toString() ?? '';
  const tglSelesai = url.searchParams.get('tanggalSelesai')?.toString() ?? '';

  const id = params.id as string
  const dataArmada = await db.query.armada.findFirst({
    where: eq(armada.id, id)
  })

  if (!dataArmada) {
    return error(404, {
      message: "Data armada tidak ditemukan",
    })
  }

  // const checkAvailabilityArmada = await db.select({
  //   tanggal_mulai: reservasi.tanggalMulai,
  //   tanggal_selesai: reservasi.tanggalSelesai,
  // }).from(reservasi).where(and(
  //   eq(reservasi.armadaId, id),
  //   ne(reservasi.statusTransaksi, 'dibatalkan')
  // ))

  // let isAvailableOnDate = true
  // if (tglMulai && tglSelesai) {
  //   const conflict = await db
  //     .select({ id: reservasi.id })
  //     .from(reservasi)
  //     .where(
  //       and(
  //         eq(reservasi.armadaId, id),
  //         ne(reservasi.statusTransaksi, 'dibatalkan'),
  //         lte(sql`${reservasi.tanggalMulai}::date`, sql`${tglSelesai}::date`),
  //         gte(sql`${reservasi.tanggalSelesai}::date`, sql`${tglMulai}::date`)
  //       )
  //     )
  //   isAvailableOnDate = conflict.length === 0
  // }


  // Kelompokkan per tanggal, cek apakah total unit terpakai >= total fisik
  const totalArmadaResult = await db
    .select({ total: count(armada.id) })
    .from(armada)
  const totalFisik = Number(totalArmadaResult[0].total)

  const semuaReservasi = await db
    .select({
      armadaId: reservasi.armadaId,
      tanggal_mulai: reservasi.tanggalMulai,
      tanggal_selesai: reservasi.tanggalSelesai,
      jumlahUnit: reservasi.jumlahUnit
    })
    .from(reservasi)
    .where(ne(reservasi.statusTransaksi, 'dibatalkan'))

  const usedByDate = new Map<string, number>()
  for (const item of semuaReservasi) {
    let current = toUtcDate(item.tanggal_mulai)
    const end = toUtcDate(item.tanggal_selesai)

    while (current <= end) {
      const key = dateKey(current)
      usedByDate.set(key, (usedByDate.get(key) ?? 0) + item.jumlahUnit)
      current = addDays(current, 1)
    }
  }

  const fullyBookedDates = [...usedByDate.entries()]
    .filter(([, used]) => used >= totalFisik)
    .map(([date]) => date)
  const unavailableDateSet = new Set(fullyBookedDates)

  for (const item of semuaReservasi) {
    if (item.armadaId !== id) continue

    let current = toUtcDate(item.tanggal_mulai)
    const end = toUtcDate(item.tanggal_selesai)

    while (current <= end) {
      unavailableDateSet.add(dateKey(current))
      current = addDays(current, 1)
    }
  }

  const unavailableDates: { tanggal_mulai: string; tanggal_selesai: string }[] = []
  for (const date of [...unavailableDateSet].sort()) {
    const lastRange = unavailableDates[unavailableDates.length - 1]
    if (!lastRange) {
      unavailableDates.push({ tanggal_mulai: date, tanggal_selesai: date })
      continue
    }

    const nextDate = dateKey(addDays(toUtcDate(lastRange.tanggal_selesai), 1))
    if (date === nextDate) {
      lastRange.tanggal_selesai = date
    } else {
      unavailableDates.push({ tanggal_mulai: date, tanggal_selesai: date })
    }
  }


  return {
    success: true,
    dataArmada,
    // isAvailableOnDate,
    availArmada: unavailableDates,
    date: {
      tglMulai,
      tglSelesai
    }
  }
}
