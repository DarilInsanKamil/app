import { db } from '$lib/server/db';
import { armada, bundle, customer, pembayaran, reservasi } from '$lib/server/db/schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

async function getTableCount(table: typeof armada | typeof bundle | typeof customer | typeof reservasi) {
	const result = await db.select({ count: count() }).from(table);
	return result[0].count;
}

export const load: PageServerLoad = async () => {
	const [
		totalArmada,
		totalBundle,
		totalCustomer,
		totalReservasi,
		menungguPembayaran,
		dpReservasi,
		lunasReservasi,
		dibatalkanReservasi,
		totalPembayaran,
		recentReservasi
	] = await Promise.all([
		getTableCount(armada),
		getTableCount(bundle),
		getTableCount(customer),
		getTableCount(reservasi),
		db
			.select({ count: count() })
			.from(reservasi)
			.where(eq(reservasi.statusTransaksi, 'menunggu_pembayaran')),
		db.select({ count: count() }).from(reservasi).where(eq(reservasi.statusTransaksi, 'dp')),
		db.select({ count: count() }).from(reservasi).where(eq(reservasi.statusTransaksi, 'lunas')),
		db.select({ count: count() }).from(reservasi).where(eq(reservasi.statusTransaksi, 'dibatalkan')),
		db
			.select({
				total: sql<string>`coalesce(sum(${pembayaran.totalPayment}), 0)`
			})
			.from(pembayaran)
			.where(eq(pembayaran.status, 'completed')),
		db.query.reservasi.findMany({
			with: {
				customer: true,
				armada: true,
				bundle: true,
				pembayaran: true
			},
			limit: 5,
			orderBy: [desc(reservasi.createdAt)]
		})
	]);

	return {
		stats: {
			totalArmada,
			totalBundle,
			totalCustomer,
			totalReservasi,
			menungguPembayaran: menungguPembayaran[0].count,
			dpReservasi: dpReservasi[0].count,
			lunasReservasi: lunasReservasi[0].count,
			dibatalkanReservasi: dibatalkanReservasi[0].count,
			totalPembayaran: Number(totalPembayaran[0].total)
		},
		recentReservasi
	};
};
