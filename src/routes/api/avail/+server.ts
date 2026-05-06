// src/routes/api/availability/+server.ts
import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { armada, bundle, reservasi } from '$lib/server/db/schema'
import { and, count, eq, gte, lte, ne, sql } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const armadaId = url.searchParams.get('armadaId')
  const bundleId = url.searchParams.get('bundleId')
  const tglMulai = url.searchParams.get('tanggalMulai')
  const tglSelesai = url.searchParams.get('tanggalSelesai')

  if ((!armadaId && !bundleId) || !tglMulai || !tglSelesai) {
    return json({ available: false, message: "Parameter tidak lengkap" }, { status: 400 })
  }

  if (armadaId) {
  const checkTerpakai = await db
    .select({
      terpakai: sql`COALESCE(SUM(${reservasi.jumlahUnit}), 0)`.mapWith(Number)
    })
    .from(reservasi)
    .where(
      and(
        ne(reservasi.statusTransaksi, 'dibatalkan'),
        lte(sql`${reservasi.tanggalMulai}::date`, sql`${tglSelesai}::date`),
        gte(sql`${reservasi.tanggalSelesai}::date`, sql`${tglMulai}::date`)
      )
    )

  const totalArmadaResult = await db
    .select({ total: count(armada.id) })
    .from(armada)

  const totalFisik = Number(totalArmadaResult[0].total)
  const totalTerpakai = checkTerpakai[0].terpakai
  const sisaUnit = totalFisik - totalTerpakai

  console.log('totalFisik:', totalFisik)
  console.log('totalTerpakai:', totalTerpakai)
  console.log('sisaUnit:', sisaUnit)

  return json({ available: sisaUnit >= 1 })
}

  if (bundleId) {
    const dataBundle = await db.query.bundle.findFirst({
      where: eq(bundle.id, bundleId)
    })
    if (!dataBundle) return json({ available: false }, { status: 404 })

    const checkTerpakai = await db
      .select({
        terpakai: sql`COALESCE(SUM(${reservasi.jumlahUnit}), 0)`.mapWith(Number)
      })
      .from(reservasi)
      .where(
        and(
          ne(reservasi.statusTransaksi, 'dibatalkan'),
          lte(sql`${reservasi.tanggalMulai}::date`, sql`${tglSelesai}::date`),
          gte(sql`${reservasi.tanggalSelesai}::date`, sql`${tglMulai}::date`)
        )
      )

    const totalArmadaResult = await db
      .select({ total: count(armada.id) })
      .from(armada)

    const totalFisik = Number(totalArmadaResult[0].total)
    const sisaUnit = totalFisik - checkTerpakai[0].terpakai
    return json({ available: sisaUnit >= dataBundle.jumlahUnit })
  }
}
