import { db } from '$lib/server/db';
import { testimoni } from '$lib/server/db/schema';
import { count, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const dataTestimoni = await db.select().from(testimoni).orderBy(desc(testimoni.createdAt));
	const totalResult = await db.select({ count: count() }).from(testimoni);

	const averageRating =
		dataTestimoni.length > 0
			? dataTestimoni.reduce((total, item) => total + item.rating, 0) / dataTestimoni.length
			: 0;

	return {
		success: true,
		dataTestimoni,
		meta: {
			totalData: totalResult[0].count,
			averageRating
		}
	};
};
