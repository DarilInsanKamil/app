import { db } from "$lib/server/db";
import { testimoni } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  upload: async ({request}) => {
    const formData = await request.formData()
    const payload = {
      nama: formData.get('nama')?.toString() ?? '',
      rating: Number(formData.get('rating')?.toString() ?? '1'),
      komentar: formData.get('komentar')?.toString() ?? '',
    }
    try {
      const result = await db.insert(testimoni).values({
        nama: payload.nama,
        komentar: payload.komentar,
        rating: payload.rating
      }).returning({ insertId: testimoni.id })
      if (result.length === 0) {
        return fail(400, {
          message: "Gagal insert data testimoni",
          values: payload
        })
      }
      return {
        success: true,
        message: "Berhasil insert data testimoni",
        id: result[0].insertId
      }
    } catch (err) {
      return fail(500, {
        message: "Internal server error",
        values: payload
      })
    }
  }
}
