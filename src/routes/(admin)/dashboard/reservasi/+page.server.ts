import { db } from '$lib/server/db';
import { reservasi } from '$lib/server/db/schema';
import { count, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')?.toString() ?? '1');
	const limit = Number(url.searchParams.get('limit')?.toString() ?? '10');
	const offset = (page - 1) * limit;

	const result = await db.query.reservasi.findMany({
		with: {
			customer: true,
			armada: true,
			bundle: true,
			pembayaran: true
		},
		limit,
		offset,
		orderBy: [desc(reservasi.createdAt)]
	});

	const totalResult = await db.select({ count: count() }).from(reservasi);
	const totalData = totalResult[0].count;
	const totalPages = Math.ceil(totalData / limit);

	return {
		success: true,
		dataReservasi: result,
		meta: {
			currentPage: page,
			totalPages,
			totalData,
			limit
		}
	};
};
