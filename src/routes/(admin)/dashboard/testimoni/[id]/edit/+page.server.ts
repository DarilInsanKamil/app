import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { testimoni } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const dataTestimoni = await db.query.testimoni.findFirst({
    where: eq(testimoni.id, params.id)
  })
  return {
    success: true,
    dataTestimoni
  }
}

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = params.id as string

    const formData = await request.formData()
    const existing = await db.query.testimoni.findFirst({
      where: eq(testimoni.id, id)
    })
    if (!existing) {
      return fail(404, {message: "Data testimoni tidak ditemukan"})
    }
    const payload = {
      nama: formData.get('nama')?.toString() || existing?.nama,
      rating: Number(formData.get('rating') ?? '1') || existing?.rating,
      komentar: formData.get('komentar')?.toString() || existing?.komentar,
    }
    try {
      const result = await db.update(testimoni).set({
        nama: payload.nama,
        rating: payload.rating,
        komentar: payload.komentar
      }).where(eq(testimoni.id, id)).returning({ updateId: testimoni.id })
      if (result.length === 0) {
        return fail(400, {
          success: false,
          message: "Gagal update data testimoni",
          values: payload
        })
      }
      return {
        success: true,
        message: "Berhasil update data testimoni",
        id: result[0].updateId
      }
    } catch (err) {
      return fail(500, {
        message: "Internal server error",
        values: payload
      })
    }

  }
}
