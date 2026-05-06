import { db } from "$lib/server/db";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { asc, count, eq, ilike } from "drizzle-orm";
import { armada } from "$lib/server/db/schema";
import { deleteImage } from "$lib/server/imageHandler";

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

export const actions: Actions = {
  delete: async ({request}) => {
    const formData = await request.formData()
    const id = formData.get('id')?.toString() ?? ''
    const existing = await db.query.armada.findFirst({
      where: eq(armada.id, id)
    })
    if (!existing) {
      return fail(404, {message: "Data armada tidak ditemukan"})
    }
    await deleteImage(existing?.publicImageId as string)
    try {
      await db.delete(armada).where(eq(armada.id, id))
    } catch (err) {
      return fail(500, {
        message: "Internal server error"
      })
    }
  }
}
