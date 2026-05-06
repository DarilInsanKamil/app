import { env } from '$env/dynamic/private';
import { midtrans } from '$lib/server/midtrans';
import { db } from '$lib/server/db';
import { pembayaran, reservasi } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type BookingPaymentSummarySource = {
	statusTransaksi: 'menunggu_pembayaran' | 'dp' | 'lunas' | 'dibatalkan' | null;
	totalHarga: string;
	pembayaran: {
		metodeBayar: 'dp' | 'lunas';
		amount: string;
	}[];
};

async function getBookingByCode(code: string) {
	const booking = await db.query.reservasi.findFirst({
		where: sql`${reservasi.kodeBooking} = ${code} OR ${reservasi.id}::text = ${code} OR ${reservasi.id}::text ILIKE ${`${code}%`}`,
		with: {
			customer: true,
			armada: true,
			bundle: true,
			pembayaran: true
		}
	});

	if (booking) return booking;

	const payment = await db.query.pembayaran.findFirst({
		where: eq(pembayaran.orderId, code)
	});

	if (!payment) return null;

	return db.query.reservasi.findFirst({
		where: eq(reservasi.id, payment.reservasiId),
		with: {
			customer: true,
			armada: true,
			bundle: true,
			pembayaran: true
		}
	});
}

function getPaymentSummary(booking: BookingPaymentSummarySource) {
	const dpPayment = booking.pembayaran.find((item) => item.metodeBayar === 'dp');
	const fullTotal = Number(dpPayment?.amount ?? booking.totalHarga);
	const paidAmount =
		booking.statusTransaksi === 'dp' && fullTotal > Number(booking.totalHarga)
			? Number(booking.totalHarga)
			: booking.statusTransaksi === 'dp'
				? Math.floor(fullTotal * 0.5)
				: fullTotal;
	const remainingAmount =
		booking.statusTransaksi === 'dp' ? Math.max(fullTotal - paidAmount, 0) : 0;

	return {
		fullTotal,
		paidAmount,
		remainingAmount
	};
}

export const load: PageServerLoad = async ({ url }) => {
	const kodeBooking = url.searchParams.get('kodeBooking')?.trim() ?? '';
	const booking = kodeBooking ? await getBookingByCode(kodeBooking) : null;

	return {
		kodeBooking,
		booking,
		paymentSummary: booking ? getPaymentSummary(booking) : null,
		clientKey: env.MERCHANT_CLIENT_ID
	};
};

export const actions: Actions = {
	pelunasan: async ({ request }) => {
		const formData = await request.formData();
		const reservasiId = formData.get('reservasiId')?.toString() ?? '';

		if (!reservasiId) {
			return fail(400, { message: 'Data reservasi tidak valid' });
		}

		const booking = await db.query.reservasi.findFirst({
			where: eq(reservasi.id, reservasiId),
			with: {
				pembayaran: true
			}
		});

		if (!booking) {
			return fail(404, { message: 'Booking tidak ditemukan' });
		}

		if (booking.statusTransaksi !== 'dp') {
			return fail(400, { message: 'Booking ini tidak membutuhkan pelunasan' });
		}

		const { fullTotal, remainingAmount } = getPaymentSummary(booking);

		if (remainingAmount <= 0) {
			return fail(400, { message: 'Sisa pelunasan tidak valid' });
		}

		try {
			const orderId = `PEL-${Date.now()}-${booking.id.slice(0, 8)}`;
			const transaction = await midtrans.createTransaction({
				transaction_details: {
					order_id: orderId,
					gross_amount: remainingAmount
				}
			});

			await db.insert(pembayaran).values({
				reservasiId: booking.id,
				orderId,
				metodeBayar: 'lunas',
				amount: String(fullTotal),
				fee: '0',
				totalPayment: String(remainingAmount),
				paymentMethod: 'midtrans_snap',
				paymentNumber: '-',
				paymentUrl: transaction.redirect_url,
				redirectUrl: `/reservasi/${booking.id}/success`,
				status: 'pending'
			});

			return {
				success: true,
				transactionToken: transaction.token,
				message: 'Token pelunasan berhasil dibuat'
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Gagal membuat transaksi pelunasan';
			return fail(500, { message });
		}
	}
};
