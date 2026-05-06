import { armada } from "$lib/server/db/schema";
import { error, fail, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { deleteImage, uploadImage } from "$lib/server/imageHandler";

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const result = await db.query.armada.findFirst({
		where: eq(armada.id, id)
	});
	if (!result) {
		throw error(404, 'Data product tidak ditemukan');
	}
	return result;
};

export const actions: Actions = {
  update: async ({ request, params }) => {
		const formData = await request.formData();
		const id = params.id as string;
		console.log(id)
		const existing = await db.query.armada.findFirst({
			where: eq(armada.id, id)
		});

		if (!existing) {
			return fail(404, { message: 'Data product tidak ditemukan' });
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
    namaArmada: formData.get('namaArmada')?.toString() || existing.namaArmada,
    jumlahUnit: Number(formData.get('jumlahUnit')?.toString() ?? '0') || existing.jumlahUnit,
    kapasitas: Number(formData.get('kapasitas')?.toString() ?? '0') || existing.kapasitas,
    platNomor: formData.get('platNomor')?.toString() || existing.platNomor,
	  deskripsi: formData.get('deskripsi')?.toString() || existing.deskripsi,
		hargaSewa: formData.get('hargaSewa')?.toString() || existing.hargaSewa,
		isAvailable: Boolean(formData.get('isAvailable')?.toString() ?? 'true') || existing.isAvailable,
  };

		try {
			const result = await db
				.update(armada)
				.set({
					namaArmada: payload.namaArmada,
					deskripsi: payload.deskripsi,
					imageUrl: payload.image,
					publicImageId: payload.publicImageId,
					jumlahUnit: payload.jumlahUnit,
					platNomor: payload.platNomor,
					hargaSewa: payload.hargaSewa,
					kapasitas: payload.kapasitas,
					isAvailable: payload.isAvailable
				})
				.where(eq(armada.id, id))
				.returning({ updateId: armada.id });
			if (result.length === 0) {
				return fail(400, {
					message: 'Gagal update data armada',
					values: payload
				});
			}
			return {
				success: true,
				message: 'Berhasil update data armada',
				id: result[0].updateId
			};
		} catch (e) {
			return fail(500, {
				message: 'Internal server error',
				values: payload
			});
		}
	}
};
