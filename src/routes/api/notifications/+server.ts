import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import midtransClient from 'midtrans-client';
import { pembayaran, reservasi } from '$lib/server/db/schema.js';
import { MERCHANT_SERVER_KEY, MERCHANT_CLIENT_ID } from '$env/static/private';

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: MERCHANT_SERVER_KEY,
  clientKey: MERCHANT_CLIENT_ID,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const notificationJson = await request.json();
    const statusResponse = await coreApi.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    let finalStatus: 'pending' | 'canceled' | 'completed' = 'pending';

    if (transactionStatus === 'capture') {
      finalStatus = fraudStatus === 'accept' ? 'completed' : 'pending';
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'completed';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      finalStatus = 'canceled';
    }

    let paymentNumber = "-";
    if (statusResponse.va_numbers?.length > 0) {
      paymentNumber = statusResponse.va_numbers[0].va_number;
    } else if (statusResponse.bca_va_number) {
      paymentNumber = statusResponse.bca_va_number;
    } else if (statusResponse.bill_key && statusResponse.biller_code) {
      paymentNumber = `${statusResponse.biller_code}${statusResponse.bill_key}`;
    }

    await db.transaction(async (tx) => {
      // Update tabel pembayaran
      const [updatedPembayaran] = await tx
        .update(pembayaran)
        .set({
          status: finalStatus,
          paymentMethod: paymentType,
          paymentNumber,
          completedAt: finalStatus === 'completed' ? new Date() : null,
        })
        .where(eq(pembayaran.orderId, orderId))
        .returning()

      if (!updatedPembayaran) return

      let statusTransaksi: 'menunggu_pembayaran' | 'dp' | 'lunas' | 'dibatalkan' = 'menunggu_pembayaran'

      if (finalStatus === 'completed') {
        // Cek apakah ini pembayaran DP atau lunas
        // dari amount vs totalHarga reservasi
        const existingReservasi = await tx.query.reservasi.findFirst({
          where: eq(reservasi.id, updatedPembayaran.reservasiId)
        })

        if (existingReservasi) {
          statusTransaksi = updatedPembayaran.metodeBayar === 'dp' ? 'dp' : 'lunas'
        }
      } else if (finalStatus === 'canceled') {
        statusTransaksi = 'dibatalkan'
      }

      await tx
        .update(reservasi)
        .set({ statusTransaksi })
        .where(eq(reservasi.id, updatedPembayaran.reservasiId))
    })

    return json({ status: 'success' });
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    return json({ status: 'error', message: error.message }, { status: 500 });
  }
};