import { db } from "$lib/server/db";
import { gallery } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { deleteImage } from "$lib/server/imageHandler";

export const load: PageServerLoad = async () => {
  const dataGallery = await db.select().from(gallery).limit(5)
  return {
    succes: true,
    dataGallery
  }
}

export const actions: Actions = {
  delete: async ({request}) => {
    const formData = await request.formData()
    const id = formData.get('id')?.toString() ?? ''
    const existing = await db.query.gallery.findFirst({
      where: eq(gallery.id, id)
    })
    if (!existing) {
      return fail(404, {message: "Data gallery tidak ditemukan"})
    }
    await deleteImage(existing?.publicImageId as string)
    try {
      await db.delete(gallery).where(eq(gallery.id, id))
    } catch (err) {
      return fail(500, {
        message: "Internal server error"
      })
    }
  }
}
