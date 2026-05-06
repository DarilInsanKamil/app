import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import { orders, pembayaran, products, queue } from '$lib/server/db/schema';
import { overlayEvents } from '$lib/server/events.js';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const { order_id, status, amount } = body;

		if (!order_id || !status) {
			return json({ error: 'Invalid payload' }, { status: 400 });
		}

		const projectSlug = env.PAKASIR_SLUG;
		const apiKey = env.PAKASIR_API_KEY;
		const verifyUrl = `https://app.pakasir.com/api/transactiondetail?project=${projectSlug}&amount=${amount}&order_id=${order_id}&api_key=${apiKey}`;

		const verifyResponse = await fetch(verifyUrl);
		const verifyData = await verifyResponse.json();

		if (
			!verifyResponse.ok ||
			!verifyData.transaction ||
			verifyData.transaction.status !== 'completed'
		) {
			return json({ error: 'Transaction verification failed' }, { status: 403 });
		}

		// ambil order + items
		const order = await db.query.orders.findFirst({
			where: eq(orders.id, order_id),
			with: {
				orderItems: true
			}
		});

		if (!order) {
			return json({ error: 'Order not found' }, { status: 404 });
		}

		if (order.status === 'paid') {
			return json({ message: 'Already processed' });
		}

		if (status === 'completed') {
			await db.transaction(async (tx) => {
				// update order
				await tx.update(orders).set({ status: 'paid' }).where(eq(orders.id, order_id));

				// update pembayaran
				await tx
					.update(pembayaran)
					.set({ status: 'completed' })
					.where(eq(pembayaran.orderId, order_id));

				// insert queue
				await tx.insert(queue).values({
					orderId: order_id,
					status: 'pending'
				});

				// update stok
				for (const item of order.orderItems) {
					await tx
						.update(products)
						.set({
							stok: sql`${products.stok} - ${item.quantity}`
						})
						.where(eq(products.id, item.productId));
				}
			});
			overlayEvents.emit('db_change');
		}

		if (status === 'canceled') {
			await db.transaction(async (tx) => {
				// update order
				await tx.update(orders).set({ status: 'canceled' }).where(eq(orders.id, order_id));

				await tx
					.update(pembayaran)
					.set({ status: 'canceled' })
					.where(eq(pembayaran.orderId, order_id));
			});
		}

		return json({ success: true });
	} catch (e) {
		console.error('Webhook Error:', e);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
