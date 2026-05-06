import { and, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { cart, orderItem, orders, products } from './db/schema';

type CheckoutType = 'buy_now' | 'cart';

type BuyNowItem = {
	productId: string;
	qty: number;
};

type CreateCheckoutSessionParams =
	| {
			type: 'buy_now';
			items: BuyNowItem[];
			cartItemIds?: never;
			userId: string;
	  }
	| {
			type: 'cart';
			items?: never;
			cartItemIds: string[];
			userId: string;
	  };

type FinalItem = {
	productId: string;
	qty: number;
	price: number;
};

export const createCheckoutSession = async (
	params: CreateCheckoutSessionParams
): Promise<string> => {
	const { type, userId } = params;

	return await db.transaction(async (tx) => {
		let finalItems: FinalItem[] = [];

		if (type === 'buy_now') {
			const productsData = await tx.query.products.findMany({
				where: inArray(
					products.id,
					params.items.map((i) => i.productId)
				)
			});

			finalItems = productsData.map((p) => {
				const item = params.items.find((i) => i.productId === p.id);
				if (!item) throw new Error('Item tidak ditemukan');

				return {
					productId: p.id,
					qty: item.qty,
					price: p.price
				};
			});
		}

		if (type === 'cart') {
			const cartItems = await tx.select().from(cart).where(inArray(cart.id, params.cartItemIds));

			const productIds = cartItems
				.map((c) => c.productId)
				.filter((id): id is string => id !== null);

			const productsData = await tx.query.products.findMany({
				where: inArray(products.id, productIds)
			});

			finalItems = cartItems.map((c) => {
				if (!c.productId) throw new Error('Cart invalid');

				const product = productsData.find((p) => p.id === c.productId);
				if (!product) throw new Error('Product not found');

				return {
					productId: product.id,
					qty: c.qty,
					price: product.price
				};
			});

			await tx.delete(cart).where(inArray(cart.id, params.cartItemIds));
		}

		const totalPrice = finalItems.reduce((acc, item) => acc + item.qty * item.price, 0);

		await tx.delete(orders).where(and(eq(orders.userId, userId), eq(orders.status, 'pending')));

		const [order] = await tx
			.insert(orders)
			.values({
				userId,
				totalPrice,
				status: 'pending'
			})
			.returning();

		await tx.insert(orderItem).values(
			finalItems.map((item) => ({
				orderId: order.id,
				productId: item.productId,
				quantity: item.qty,
				price: item.price
			}))
		);

		return order.id;
	});
};
