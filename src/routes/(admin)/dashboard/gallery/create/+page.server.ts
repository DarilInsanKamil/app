import { db } from "$lib/server/db";
import { gallery } from "$lib/server/db/schema";
import { uploadImage } from "$lib/server/imageHandler";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  upload: async ({request}) => {
    const formData = await request.formData();
		const gambarFile = formData.get('image') as File;

		if (
			!gambarFile ||
			!(gambarFile instanceof File) ||
			gambarFile.size === 0 ||
			gambarFile.name === ''
		) {
			return fail(400, {
				message: 'Gambar wajib diupload'
			});
		}
    const imageData = await uploadImage(gambarFile, 'gallery');
    const payload = {
      imageUrl: imageData.secure_url,
      publicImageId: imageData.public_id,
      deskripsi: formData.get('deskripsi')?.toString() ?? ''
    }
    try {
      const result = await db.insert(gallery).values({
        imageUrl: payload.imageUrl,
        publicImageId: payload.publicImageId,
        deskripsi: payload.deskripsi
      }).returning({ insertId: gallery.id })
      if (result.length === 0) {
        return fail(400, {
          message: "Gagal insert data gallery",
          success: false,
        })
      }
      return {
        success: true,
        message: "Berhasil insert data gallery",
        id: result[0].insertId,
        values: payload
      }
    } catch (err) {
      return fail(500, {
        message: "Internal server error",
        values:payload
      })
    }
  }
}
