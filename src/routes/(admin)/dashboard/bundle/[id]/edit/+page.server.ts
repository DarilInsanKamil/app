import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { bundle } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { deleteImage, uploadImage } from "$lib/server/imageHandler";

export const load: PageServerLoad = async ({params}) => {
  const dataBundle = await db.query.bundle.findFirst({
    where: eq(bundle.id, params.id)
  })
  return {
    success: true,
    dataBundle
  }
}

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = params.id as string
    const formData = await request.formData()

    const existing = await db.query.bundle.findFirst({
      where: eq(bundle.id, id)
    })
    if (!existing) {
      return fail(404, {message: "Data bundle tidak ditemukan"})
    }
    const gambarFile = formData.get('image') as File;
		let imageUrl = existing.imageUrl;
		let imagePublicId = existing.publicImageId;

		if (gambarFile && gambarFile instanceof File && gambarFile.size > 0) {
			const imageData = await uploadImage(gambarFile, 'product');

			if (existing.publicImageId) {
				await deleteImage(existing.publicImageId);
			}

			imageUrl = imageData.secure_url;
			imagePublicId = imageData.public_id;
    }

    const payload = {
      image: imageUrl,
      publicImageId: imagePublicId,
      namaBundle: formData.get('namaBundle')?.toString() || existing.namaBundle,
      deskripsi: formData.get('deskripsi')?.toString() || existing.deskripsi,
      hargaBundle: formData.get('hargaBundle')?.toString() || existing.hargaBundle,
      jumlahUnit: Number(formData.get('jumlahUnit')?.toString() ?? '0') || existing.jumlahUnit,
      addOns: JSON.parse(formData.get('addOns')?.toString() ?? '') || existing.addOns,
    }

    try {
      const result = await db.update(bundle).set({
        namaBundle: payload.namaBundle,
        imageUrl: payload.image,
        publicImageId: payload.publicImageId,
        deskripsi: payload.deskripsi,
        hargaBundle: payload.hargaBundle,
        jumlahUnit: payload.jumlahUnit,
        addOns: payload.addOns,
      }).where(eq(bundle.id, id)).returning({ updateId: bundle.id })
      if (result.length === 0) {
        return fail(400, {
          message: "Gagal update data bundle",
          values: payload
        })
      }
    } catch (err) {
      return fail(500, {
        message: "Internal server error",
        values: payload
      })
    }
  }
}
