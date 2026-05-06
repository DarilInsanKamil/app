import { db } from "$lib/server/db";
import { armada } from "$lib/server/db/schema";
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
    const imageData = await uploadImage(gambarFile, 'armada');
    const payload = {
			image: imageData.secure_url,
      publicImageId: imageData.public_id,
			namaArmada: formData.get('namaArmada')?.toString() ?? '',
			jumlahUnit: Number(formData.get('jumlahUnit')?.toString() ?? '0'),
			kapasitas: Number(formData.get('kapasitas')?.toString() ?? '0'),
			platNomor: formData.get('platNomor')?.toString() ?? '',
			deskripsi: formData.get('deskripsi')?.toString() ?? '',
			hargaSewa: formData.get('hargaSewa')?.toString() ?? '0',
			isAvailable: Boolean(formData.get('isAvailable')?.toString() ?? 'true'),
    };
    try {
      const result = await db.insert(armada).values({
        imageUrl: payload.image,
        publicImageId: payload.publicImageId,
        namaArmada: payload.namaArmada,
        jumlahUnit: payload.jumlahUnit,
        platNomor: payload.platNomor,
        kapasitas: payload.kapasitas,
        deskripsi: payload.deskripsi,
        isAvailable: payload.isAvailable,
        hargaSewa: payload.hargaSewa,
      }).returning({ insertId: armada.id })
      if (result.length === 0) {
        return fail(400, {
          message: 'Gagal insert data armada',
          values: payload
        })
      }
      return {
        succcess: true,
        message: "Berhasil insert data armada",
        id: result[0].insertId
      }
    } catch (e) {
     	return fail(500, {
				message: 'Internal server error',
				values: payload
			});
    }

  }
}
