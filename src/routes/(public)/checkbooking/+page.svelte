<script lang="ts">
	import { enhance } from '$app/forms';
	import { fmt, formatDate } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		CalendarDays,
		CircleAlert,
		CircleDollarSign,
		CreditCard,
		Frown,
		MapPin,
		PackageCheck,
		Search,
		UserRound
	} from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let isPaying = $state(false);

	function getItemName() {
		return data.booking?.armada?.namaArmada ?? data.booking?.bundle?.namaBundle ?? '-';
	}

	function getItemType() {
		return data.booking?.armada ? 'Armada' : data.booking?.bundle ? 'Bundle' : '-';
	}

	function getStatusClass(status?: string | null) {
		if (status === 'lunas') return 'bg-green-100 text-green-800';
		if (status === 'dp' || status === 'menunggu_pembayaran') return 'bg-yellow-100 text-yellow-800';
		if (status === 'dibatalkan') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-700';
	}

	function getPaymentStatusClass(status?: string | null) {
		if (status === 'completed') return 'bg-green-100 text-green-800';
		if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'canceled') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-700';
	}

	function getDisplayCode() {
		return data.booking?.kodeBooking ?? data.booking?.pembayaran?.[0]?.orderId ?? data.booking?.id.slice(0, 8);
	}

	function loadSnapScript(clientKey: string): Promise<void> {
		return new Promise((resolve) => {
			if (document.getElementById('snap-script')) return resolve();

			const script = document.createElement('script');
			script.id = 'snap-script';
			script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
			script.setAttribute('data-client-key', clientKey);
			script.onload = () => resolve();
			document.head.appendChild(script);
		});
	}

	function openSnap(token: string) {
		(
			window as typeof window & {
				snap: {
					pay: (
						token: string,
						options: {
							onSuccess: () => void;
							onPending: () => void;
							onError: () => void;
							onClose: () => void;
						}
					) => void;
				};
			}
		).snap.pay(token, {
			onSuccess: () => location.reload(),
			onPending: () => location.reload(),
			onError: () => location.reload(),
			onClose: () => {
				isPaying = false;
			}
		});
	}
</script>

<svelte:head>
	<title>Cek Booking - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-10 px-5 md:mt-30 md:px-10">
	<div class="container mx-auto px-4 md:px-8 lg:px-20">
		<section class="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
			<div>
				<p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-800">Cek Booking</p>
				<h1 class="mb-3 text-4xl font-bold tracking-tight text-green-950">
					Cek Status Reservasi Anda
				</h1>
				<p class="max-w-2xl text-gray-600">
					Masukkan kode booking untuk melihat detail reservasi, status transaksi, dan melakukan
					pelunasan jika pembayaran masih DP.
				</p>
			</div>

		</section>

		<section class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<form method="GET" class="flex flex-col gap-4 md:flex-row">
				<div class="flex-1">
					<label for="kodeBooking" class="mb-2 block text-sm font-medium text-gray-700">
						Kode Booking
					</label>
					<input
						id="kodeBooking"
						name="kodeBooking"
						value={data.kodeBooking}
						placeholder="Contoh: RSV-xxxx atau kode booking"
						class="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-900 focus:ring-2 focus:ring-green-900/20"
					/>
				</div>
				<div class="flex items-end">
					<Button type="submit" class="w-full bg-green-900 hover:bg-green-800 md:w-auto">
						<Search size={18} />
						Cek Booking
					</Button>
				</div>
			</form>
		</section>

		{#if data.kodeBooking && !data.booking}
			<section class="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
					<Frown size={28} />
				</div>
				<h2 class="mb-2 text-xl font-semibold text-gray-700">Booking tidak ditemukan</h2>
				<p class="text-gray-500">Periksa kembali kode booking atau order ID pembayaran Anda.</p>
			</section>
		{/if}

		{#if data.booking}
			<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<div class="space-y-5">
					<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<p class="text-sm font-medium text-gray-500">Kode Booking</p>
								<h2 class="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
									{getDisplayCode()}
								</h2>
							</div>
							<span
								class={`w-fit rounded px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
									data.booking.statusTransaksi
								)}`}
							>
								{data.booking.statusTransaksi?.replaceAll('_', ' ') ?? '-'}
							</span>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div class="rounded-lg border border-gray-200 p-4">
								<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
									<UserRound size={18} class="text-green-800" />
									Customer
								</h3>
								<div class="space-y-2 text-sm text-gray-600">
									<p>
										<span class="font-medium text-gray-900">Nama:</span>
										{data.booking.customer?.namaLengkap ?? '-'}
									</p>
									<p>
										<span class="font-medium text-gray-900">Email:</span>
										{data.booking.customer?.email ?? '-'}
									</p>
									<p>
										<span class="font-medium text-gray-900">No HP:</span>
										{data.booking.customer?.noHp ?? '-'}
									</p>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 p-4">
								<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
									<PackageCheck size={18} class="text-green-800" />
									Reservasi
								</h3>
								<div class="space-y-2 text-sm text-gray-600">
									<p><span class="font-medium text-gray-900">Tipe:</span> {getItemType()}</p>
									<p><span class="font-medium text-gray-900">Nama:</span> {getItemName()}</p>
									<p><span class="font-medium text-gray-900">Jumlah:</span> {data.booking.jumlahUnit} unit</p>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 p-4">
								<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
									<CalendarDays size={18} class="text-green-800" />
									Jadwal
								</h3>
								<div class="space-y-2 text-sm text-gray-600">
									<p><span class="font-medium text-gray-900">Mulai:</span> {formatDate(data.booking.tanggalMulai)}</p>
									<p><span class="font-medium text-gray-900">Selesai:</span> {formatDate(data.booking.tanggalSelesai)}</p>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 p-4">
								<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
									<MapPin size={18} class="text-green-800" />
									Lokasi Jemput
								</h3>
								<p class="text-sm leading-6 text-gray-600">{data.booking.lokasiJemput ?? '-'}</p>
							</div>
						</div>
					</div>

					<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-200 px-6 py-4">
							<h3 class="font-semibold tracking-tight text-gray-900">Riwayat Pembayaran</h3>
						</div>
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm text-gray-500">
								<thead class="bg-green-100 text-xs uppercase text-gray-700">
									<tr>
										<th class="px-6 py-3 font-medium">Order ID</th>
										<th class="px-6 py-3 font-medium">Metode</th>
										<th class="px-6 py-3 font-medium">Nominal</th>
										<th class="px-6 py-3 font-medium">Status</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-green-200 bg-white">
									{#each data.booking.pembayaran as payment (payment.id)}
										<tr>
											<td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
												{payment.orderId}
											</td>
											<td class="whitespace-nowrap px-6 py-4 capitalize">{payment.metodeBayar}</td>
											<td class="whitespace-nowrap px-6 py-4">
												{fmt(Number(payment.totalPayment))}
											</td>
											<td class="whitespace-nowrap px-6 py-4">
												<span
													class={`rounded px-2 py-1 text-xs font-semibold capitalize ${getPaymentStatusClass(
														payment.status
													)}`}
												>
													{payment.status}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<aside class="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900">
						<CircleDollarSign size={20} class="text-green-800" />
						Ringkasan Pembayaran
					</h3>

					<div class="space-y-3 text-sm">
						<div class="flex justify-between border-b border-gray-100 pb-3">
							<span class="text-gray-500">Total tagihan</span>
							<span class="font-medium text-gray-900">{fmt(data.paymentSummary?.fullTotal ?? 0)}</span>
						</div>
						<div class="flex justify-between border-b border-gray-100 pb-3">
							<span class="text-gray-500">Sudah dibayar</span>
							<span class="font-medium text-gray-900">{fmt(data.paymentSummary?.paidAmount ?? 0)}</span>
						</div>
						<div class="flex justify-between rounded-md bg-green-50 px-3 py-3">
							<span class="font-medium text-green-900">Sisa pelunasan</span>
							<span class="font-semibold text-green-950">{fmt(data.paymentSummary?.remainingAmount ?? 0)}</span>
						</div>
					</div>

					{#if form?.message}
						<div class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{form.message}
						</div>
					{/if}

					{#if data.booking.statusTransaksi === 'dp'}
						<form
							method="POST"
							action="?/pelunasan"
							class="mt-5"
							use:enhance={() => {
								isPaying = true;
								return async ({ result, update }) => {
									if (result.type === 'success') {
										const token = (result.data as { transactionToken?: string } | undefined)?.transactionToken;
										if (token) {
											await loadSnapScript(data.clientKey ?? '');
											openSnap(token);
										}
									} else {
										await update();
										isPaying = false;
									}
								};
							}}
						>
							<input type="hidden" name="reservasiId" value={data.booking.id} />
							<Button type="submit" class="w-full bg-green-900 hover:bg-green-800" disabled={isPaying}>
								<CreditCard size={18} />
								{isPaying ? 'Memproses...' : 'Bayar Pelunasan'}
							</Button>
						</form>
					{:else if data.booking.statusTransaksi === 'lunas'}
						<div class="mt-5 flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
							<CircleAlert size={18} />
							Reservasi sudah lunas.
						</div>
					{/if}
				</aside>
			</section>
		{/if}
	</div>
</main>
