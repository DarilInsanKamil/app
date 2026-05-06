import { db } from "$lib/server/db";
import { bundle } from "$lib/server/db/schema";
import { uploadImage } from "$lib/server/imageHandler";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  upload: async ({ request }) => {
    const formData = await request.formData()
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
    const imageData = await uploadImage(gambarFile, 'bundle');
    const payload = {
      imageUrl: imageData.secure_url,
      publicImageId: imageData.public_id,
      namaBundle: formData.get('namaBundle')?.toString() ?? '',
      deskripsi: formData.get('deskripsi')?.toString() ?? '',
      hargaBundle: formData.get('hargaBundle')?.toString() ?? '',
      jumlahUnit: Number(formData.get('jumlahUnit')?.toString() ?? '0'),
      addOns: JSON.parse(formData.get('addOns')?.toString() ?? ''),
    }
    try {
      const result = await db.insert(bundle).values({
        namaBundle: payload.namaBundle,
        imageUrl: payload.imageUrl,
        publicImageId: payload.publicImageId,
        deskripsi: payload.deskripsi,
        hargaBundle: payload.hargaBundle,
        jumlahUnit: payload.jumlahUnit,
        addOns: payload.addOns,
      }).returning({ insertId: bundle.id })
      if (result.length === 0) {
        return fail(400, {
          message: "Gagal insert data bundle",
          values: payload
        })
      }
      return {
        success: true,
        message: "Berhasil insert data bundle",
        id: result[0].insertId
      }
    } catch (e) {
      return fail(500, {
        message: "Internal server error",
        values: payload
      })
    }
  }
}
