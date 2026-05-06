import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import { asc, count, ilike } from "drizzle-orm";
import { armada } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get('search')?.toString() ?? ''
  const page = Number(url.searchParams.get('page')?.toString() ?? '1')
  const limit = Number(url.searchParams.get('limit')?.toString() ?? '10')
  const offset = (page - 1) * limit;
  const result = await db.select().from(armada)
    .where(search ? ilike(armada.namaArmada, `%${search}%`) : undefined)
    .limit(limit)
    .offset(offset)
    .orderBy(asc(armada.createdAt))

  const totalResult = await db.select({ count: count() })
    .from(armada)
    .where(search ? ilike(armada.namaArmada, `%${search}%`) : undefined)
  const totalData = totalResult[0].count
  const totalPages = Math.ceil(totalData / limit)

  return {
    success: true,
    dataArmada: result,
   	meta: {
			currentPage: page,
			totalPages,
			totalData,
			limit,
			search
		}
	};
}
