import { armada, bundle, reservasi } from "$lib/server/db/schema"
import { and, count, eq, gte, lte, ne, sql } from "drizzle-orm"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { db } from "$lib/server/db"

export const load: PageServerLoad = async ({ params, url }) => {
    const bundleId = params.id
    const startParam = url.searchParams.get('tanggalMulai')
    const endParam = url.searchParams.get('tanggalSelesai')

    const dataBundle = await db.query.bundle.findFirst({
        where: eq(bundle.id, bundleId)
    })

    if (!dataBundle) {
        error(404, { message: "Data bundle tidak ditemukan" })
    }

    let sisaUnitTersedia = dataBundle.jumlahUnit

    if (startParam && endParam) {
        const checkTerpakai = await db
            .select({
                terpakai: sql`COALESCE(SUM(${reservasi.jumlahUnit}), 0)`.mapWith(Number)
            })
            .from(reservasi)
            .where(
                and(
                    ne(reservasi.statusTransaksi, 'dibatalkan'),
                    lte(sql`${reservasi.tanggalMulai}::date`, sql`${endParam}::date`),
                    gte(sql`${reservasi.tanggalSelesai}::date`, sql`${startParam}::date`)
                )
            )

        const totalTerpakai = checkTerpakai[0].terpakai

        // Total armada fisik yang ada
        const totalArmadaResult = await db
            .select({ total: count(armada.id) })
            .from(armada)

        const totalFisik = Number(totalArmadaResult[0].total)
        sisaUnitTersedia = totalFisik - totalTerpakai
    }

    return {
        dataBundle,
        sisaUnitTersedia,
        tanggalMulai: startParam,
        tanggalSelesai: endParam
    }
}