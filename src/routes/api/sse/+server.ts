import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { queue } from '$lib/server/db/schema';
import { overlayEvents } from '$lib/server/events';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = ({ request }) => {
	let isOpen = true;

	const stream = new ReadableStream({
		start(controller) {
			const emit = (data: any) => {
				if (!isOpen) return;

				try {
					controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
				} catch (err) {
					console.error('Gagal enqueue data, mungkin stream sudah tertutup:', err);
					isOpen = false;
				}
			};

			const sendLatestData = async () => {
				try {
					const queueResult = await db.query.queue.findMany({
						where: eq(queue.status, 'pending'),
						columns: {
							id: true,
							status: true
						},
						with: {
							order: {
								columns: {},
								with: {
									user: {
										columns: {
											name: true
										}
									},
									orderItems: {
										columns: {
											quantity: true
										},
										with: {
											product: {
												columns: {
													nama: true
												}
											}
										}
									}
								}
							}
						},
						limit: 5
					});
					emit(queueResult);
				} catch (err) {
					console.error('Gagal ambil data DB:', err);
				}
			};

			sendLatestData();

			const listener = () => {
				sendLatestData();
			};

			overlayEvents.on('db_change', listener);

			request.signal.addEventListener('abort', () => {
				isOpen = false;
				overlayEvents.off('db_change', listener);

				try {
					controller.close();
				} catch (e) {}
			});
		},
		cancel() {
			isOpen = false;
			overlayEvents.removeAllListeners('db_change');
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
