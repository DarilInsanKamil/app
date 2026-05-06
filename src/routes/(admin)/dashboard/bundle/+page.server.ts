import { db } from "$lib/server/db";
import { bundle } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { deleteImage } from "$lib/server/imageHandler";

export const load: PageServerLoad = async () => {
  const result = await db.select().from(bundle).limit(5)
  return {
    success: true,
    dataBundle: result
  }
}

export const actions: Actions = {
  delete: async ({request}) => {
    const formData = await request.formData()
    const id = formData.get('id')?.toString() ?? ''
    const existing = await db.query.bundle.findFirst({
      where: eq(bundle.id, id)
    })
    if (!existing) {
      return fail(404, {message: "Data bundle tidak ditemukan"})
    }
    await deleteImage(existing?.publicImageId as string)
    try {
      await db.delete(bundle).where(eq(bundle.id, id))
    } catch (err) {
      return fail(500, {
        message: "Internal server error"
      })
    }
  }
}
