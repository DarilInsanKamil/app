import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { armada, bundle, customer, pembayaran, reservasi } from "$lib/server/db/schema";
import { error, fail, type Actions } from "@sveltejs/kit";
import { midtrans } from "$lib/server/midtrans";
import { env } from "$env/dynamic/private";

function durationInDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

export const load: PageServerLoad = async ({ url }) => {
  const armadaId = url.searchParams.get('armadaId')
  const bundleId = url.searchParams.get('bundleId')
  const tanggalMulai = url.searchParams.get('tanggalMulai')
  const tanggalSelesai = url.searchParams.get('tanggalSelesai')

  if (!armadaId && !bundleId) {
    error(400, "Tidak ada kendaran yang dipilih")
  }

  if (!tanggalMulai || !tanggalSelesai) {
    error(400, "Tanggal reservasi tidak valid")
  }
  const durasi = durationInDays(tanggalMulai, tanggalSelesai)

  if (armadaId) {
    const existingArmada = await db.query.armada.findFirst({
      where: eq(armada.id, armadaId)
    })
    if (!existingArmada) {
      error(404, "Data armada tidak ditemukan")
    }
    return {
      tipe: 'armada' as const,
      dataArmada: existingArmada,
      totalHarga: Number(existingArmada.hargaSewa) * durasi,
      tanggalMulai,
      tanggalSelesai,
      durasi,
      clientKey: env.MERCHANT_CLIENT_ID

    }
  }
  if (bundleId) {
    const existingBundle = await db.query.bundle.findFirst({
      where: eq(bundle.id, bundleId)
    })
    if (!existingBundle) {
      error(404, "Data bundle tidak ditemukan")
    }

    return {
      tipe: 'bundle' as const,
      dataBundle: existingBundle,
      totalHarga: Number(existingBundle.hargaBundle) * durasi,
      tanggalMulai,
      tanggalSelesai,
      durasi,
      clientKey: env.MERCHANT_CLIENT_ID
    }
  }
}


export const actions: Actions = {
  upload: async ({ request }) => {

    const formData = await request.formData()
    const armadaId = formData.get('armadaId')?.toString() || null
    const bundleId = formData.get('bundleId')?.toString() || null
    const tanggalMulai = formData.get('tanggalMulai')?.toString() ?? ''
    const tanggalSelesai = formData.get('tanggalSelesai')?.toString() ?? ''

    const durasi = durationInDays(tanggalMulai, tanggalSelesai)

    if (!tanggalMulai || !tanggalSelesai) {
      return fail(400, { message: "Tanggal reservasi tidak valid" })
    }

    if (!armadaId && !bundleId) {
      return fail(400, { message: "Tidak ada kendaraan yang dipilih" })
    }

    let totalHarga = 0
    let jumlahUnit = 0

    const nama = formData.get("nama")?.toString().trim() ?? ''
    const email = formData.get("email")?.toString().trim() ?? ''
    const noHp = formData.get("noHp")?.toString().trim() ?? ''
    const alamatJemput = formData.get("alamatJemput")?.toString().trim() ?? ''

    if (!nama || !email || !noHp || !alamatJemput) {
      return fail(400, { message: "Semua field wajib diisi" })
    }

    if (armadaId) {
      const existingArmada = await db.query.armada.findFirst({
        where: eq(armada.id, armadaId)
      })
      if (!existingArmada) {
        error(404, "Data armada tidak ditemukan")
      }
      totalHarga = Number(existingArmada.hargaSewa) * durasi
      jumlahUnit = Number(existingArmada.jumlahUnit ?? 1)
    }
    if (bundleId) {
      const existingBundle = await db.query.bundle.findFirst({
        where: eq(bundle.id, bundleId)
      })
      if (!existingBundle) {
        error(404, "Data bundle tidak ditemukan")
      }
      totalHarga = Number(existingBundle.hargaBundle) * durasi
      jumlahUnit = Number(existingBundle.jumlahUnit)
    }

    let reservasiId: string | null = null
    const kodeBooking = `JSP-${Date.now().toString(36).toUpperCase()}`
    const metodeBayar = formData.get("metodeBayar")?.toString() as 'dp' | 'lunas' ?? 'lunas'
    const nominalBayar = metodeBayar === 'dp'
      ? totalHarga * 0.5  
      : totalHarga
    await db.transaction(async (tx) => {
      const existingCustomer = await tx.query.customer.findFirst({
        where: eq(customer.email, email)
      })
      const savedCustomer = existingCustomer ?? (
        await tx.insert(customer).values({
          namaLengkap: nama,
          email,
          noHp
        }).returning()
      )[0]

      const [newReservasi] = await tx.insert(reservasi).values({
        armadaId,
        bundleId,
        customerId: savedCustomer.id,
        totalHarga: String(nominalBayar),
        tanggalMulai,
        tanggalSelesai,
        kodeBooking,
        lokasiJemput: alamatJemput,
        jumlahUnit
      }).returning()
      reservasiId = newReservasi.id


    })
    try {

      const snapOrderId = `RSV-${Date.now()}-${reservasiId?.slice(0, 8)}`
      const parameter = {
        transaction_details: {
          order_id: snapOrderId,
          gross_amount: nominalBayar
        },
        credit_card: { secure: true }
      };

      const transaction = await midtrans.createTransaction(parameter)
      const transactionToken = transaction.token

      await db.insert(pembayaran).values({
        reservasiId: reservasiId!,
        orderId: snapOrderId,
        amount: String(totalHarga),
        fee: "0",
        totalPayment: String(totalHarga),
        paymentMethod: "midtrans_snap",
        paymentNumber: "-",
        paymentUrl: transaction.redirect_url,
        redirectUrl: `/reservasi/${reservasiId}/sukses`,
        metodeBayar,
        status: 'pending'
      })

      return {
        success: true,
        transactionToken,
        reservasiId
      }
    } catch (e: any) {
      return fail(500, {
        error: e.message ?? "Gagal membuat transaksi",
      });
    }
  }
}
