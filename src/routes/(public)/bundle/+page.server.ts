import { db } from '$lib/server/db';
import { bundle } from '$lib/server/db/schema';
import { asc, count, ilike } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search')?.toString() ?? '';
	const page = Number(url.searchParams.get('page')?.toString() ?? '1');
	const limit = Number(url.searchParams.get('limit')?.toString() ?? '10');
	const offset = (page - 1) * limit;

	const result = await db
		.select()
		.from(bundle)
		.where(search ? ilike(bundle.namaBundle, `%${search}%`) : undefined)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(bundle.createdAt));

	const totalResult = await db
		.select({ count: count() })
		.from(bundle)
		.where(search ? ilike(bundle.namaBundle, `%${search}%`) : undefined);
	const totalData = totalResult[0].count;
	const totalPages = Math.ceil(totalData / limit);

	return {
		success: true,
		dataBundle: result,
		meta: {
			currentPage: page,
			totalPages,
			totalData,
			limit,
			search
		}
	};
};
