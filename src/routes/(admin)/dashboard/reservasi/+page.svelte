<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fmt, formatDate } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		CalendarDays,
		CircleDollarSign,
		Eye,
		Frown,
		MapPin,
		MessageCircle,
		PackageCheck,
		Phone,
		User,
		X
	} from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type ReservasiItem = PageProps['data']['dataReservasi'][number];

	let selectedReservasi = $state<ReservasiItem | null>(null);

	const changePage = (newPage: number) => {
		const url = new URL(page.url);
		url.searchParams.set('page', newPage.toString());
		goto(url.toString(), { keepFocus: true });
	};

	function getItemName(item: ReservasiItem) {
		return item.armada?.namaArmada ?? item.bundle?.namaBundle ?? 'Tidak tersedia';
	}

	function getItemType(item: ReservasiItem) {
		return item.armada ? 'Armada' : 'Bundle';
	}

	function getPaymentStatus(item: ReservasiItem) {
		return item.pembayaran?.[0]?.status ?? 'pending';
	}

	function getPaymentMethod(item: ReservasiItem) {
		return item.pembayaran?.[0]?.metodeBayar ?? '-';
	}

	function getStatusClass(status: string | null) {
		if (status === 'lunas' || status === 'completed') return 'bg-green-100 text-green-800';
		if (status === 'dp' || status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'dibatalkan' || status === 'canceled') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-700';
	}

	function normalizePhone(phone?: string | null) {
		if (!phone) return '';
		const cleaned = phone.replace(/\D/g, '');
		if (cleaned.startsWith('0')) return `62${cleaned.slice(1)}`;
		if (cleaned.startsWith('62')) return cleaned;
		return cleaned;
	}

	function getWhatsappUrl(item: ReservasiItem) {
		const phone = normalizePhone(item.customer?.noHp);
		const message = [
			`Halo ${item.customer?.namaLengkap ?? 'Kak'},`,
			`Kami dari Jeep Station Puncak ingin mengonfirmasi reservasi ${getItemType(item)} ${getItemName(item)}.`,
			`Tanggal: ${formatDate(item.tanggalMulai)} - ${formatDate(item.tanggalSelesai)}`,
			`Kode booking: ${item.kodeBooking ?? item.id.slice(0, 8)}`,
			`Lokasi jemput: ${item.lokasiJemput ?? '-'}`
		].join('\n');

		return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
	}
</script>

<section class="w-full p-5 lg:p-10">
	<section class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight text-gray-900">Daftar Reservasi</h1>
			<p class="mt-1 text-sm text-gray-500">Kelola data reservasi dan hubungi customer.</p>
		</div>
	</section>

	<div class="w-full overflow-hidden rounded-lg border border-gray-200 lg:mt-5">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500">
				<thead class="bg-green-100 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3 font-medium">No</th>
						<th scope="col" class="px-6 py-3 font-medium">Customer</th>
						<th scope="col" class="px-6 py-3 font-medium">Reservasi</th>
						<th scope="col" class="px-6 py-3 font-medium">Tanggal</th>
						<th scope="col" class="px-6 py-3 font-medium">Total</th>
						<th scope="col" class="px-6 py-3 font-medium">Status</th>
						<th scope="col" class="px-6 py-3 font-medium">Detail</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-green-200 bg-white">
					{#if data.dataReservasi && data.dataReservasi.length > 0}
						{#each data.dataReservasi as reservasi, i (reservasi.id)}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
									{(data.meta.currentPage - 1) * data.meta.limit + i + 1}
								</td>
								<td class="px-6 py-4">
									<p class="whitespace-nowrap font-medium text-gray-900">
										{reservasi.customer?.namaLengkap ?? '-'}
									</p>
									<p class="mt-1 flex items-center gap-1 text-xs text-gray-500">
										<Phone size={14} />
										{reservasi.customer?.noHp ?? '-'}
									</p>
								</td>
								<td class="px-6 py-4">
									<p class="whitespace-nowrap font-medium text-gray-900">
										{getItemName(reservasi)}
									</p>
									<span class="mt-1 inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
										{getItemType(reservasi)}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-gray-700">
									{formatDate(reservasi.tanggalMulai)}
									<span class="text-gray-400">s/d</span>
									{formatDate(reservasi.tanggalSelesai)}
								</td>
								<td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
									{fmt(Number(reservasi.totalHarga))}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span
										class={`rounded px-2 py-1 text-xs font-semibold capitalize ${getStatusClass(
											reservasi.statusTransaksi
										)}`}
									>
										{reservasi.statusTransaksi?.replaceAll('_', ' ') ?? '-'}
									</span>
								</td>
								<td class="px-6 py-4">
									<Button size="sm" variant="outline" onclick={() => (selectedReservasi = reservasi)}>
										<Eye size={16} />
										Detail
									</Button>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-10 text-center">
								<div class="flex flex-col items-center justify-center space-y-2">
									<Frown size={40} color="#b5b5b5" />
									<p class="text-gray-500">Belum ada data reservasi tersedia.</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<div class="flex justify-center">
		{#if data.meta.totalPages > 1}
			<div class="mt-4 flex items-center gap-2">
				<Button
					variant="outline"
					disabled={data.meta.currentPage === 1}
					onclick={() => changePage(data.meta.currentPage - 1)}
				>
					Sebelumnya
				</Button>

				<span>Halaman {data.meta.currentPage} dari {data.meta.totalPages}</span>

				<Button
					variant="outline"
					disabled={data.meta.currentPage === data.meta.totalPages}
					onclick={() => changePage(data.meta.currentPage + 1)}
				>
					Selanjutnya
				</Button>
			</div>
		{/if}
	</div>
</section>

{#if selectedReservasi}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
		<div
			class="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reservasi-detail-title"
		>
			<div class="flex items-center justify-between border-b border-green-100 bg-green-50 px-6 py-4">
				<div>
					<h2 id="reservasi-detail-title" class="text-xl font-semibold tracking-tight text-gray-900">
						Detail Reservasi
					</h2>
					<p class="text-sm text-gray-500">
						{selectedReservasi.kodeBooking ?? selectedReservasi.id}
					</p>
				</div>
				<Button size="icon-sm" variant="outline" onclick={() => (selectedReservasi = null)}>
					<X size={18} />
				</Button>
			</div>

			<div class="grid max-h-[75vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
						<User size={18} class="text-green-800" />
						Data Customer
					</h3>
					<div class="space-y-2 text-sm text-gray-600">
						<p><span class="font-medium text-gray-900">Nama:</span> {selectedReservasi.customer?.namaLengkap ?? '-'}</p>
						<p><span class="font-medium text-gray-900">Email:</span> {selectedReservasi.customer?.email ?? '-'}</p>
						<p><span class="font-medium text-gray-900">No HP:</span> {selectedReservasi.customer?.noHp ?? '-'}</p>
					</div>
				</div>

				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
						<PackageCheck size={18} class="text-green-800" />
						Paket Reservasi
					</h3>
					<div class="space-y-2 text-sm text-gray-600">
						<p><span class="font-medium text-gray-900">Tipe:</span> {getItemType(selectedReservasi)}</p>
						<p><span class="font-medium text-gray-900">Nama:</span> {getItemName(selectedReservasi)}</p>
						<p><span class="font-medium text-gray-900">Jumlah Unit:</span> {selectedReservasi.jumlahUnit} unit</p>
					</div>
				</div>

				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
						<CalendarDays size={18} class="text-green-800" />
						Jadwal & Lokasi
					</h3>
					<div class="space-y-2 text-sm text-gray-600">
						<p><span class="font-medium text-gray-900">Mulai:</span> {formatDate(selectedReservasi.tanggalMulai)}</p>
						<p><span class="font-medium text-gray-900">Selesai:</span> {formatDate(selectedReservasi.tanggalSelesai)}</p>
						<p class="flex items-start gap-2">
							<MapPin size={16} class="mt-0.5 text-green-800" />
							<span>{selectedReservasi.lokasiJemput ?? '-'}</span>
						</p>
					</div>
				</div>

				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">
						<CircleDollarSign size={18} class="text-green-800" />
						Pembayaran
					</h3>
					<div class="space-y-2 text-sm text-gray-600">
						<p><span class="font-medium text-gray-900">Total:</span> {fmt(Number(selectedReservasi.totalHarga))}</p>
						<p><span class="font-medium text-gray-900">Metode:</span> {getPaymentMethod(selectedReservasi)}</p>
						<p>
							<span class="font-medium text-gray-900">Status bayar:</span>
							<span class={`ml-1 rounded px-2 py-1 text-xs font-semibold capitalize ${getStatusClass(getPaymentStatus(selectedReservasi))}`}>
								{getPaymentStatus(selectedReservasi)}
							</span>
						</p>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
				<Button variant="outline" onclick={() => (selectedReservasi = null)}>Tutup</Button>
				<a
					href={getWhatsappUrl(selectedReservasi)}
					target="_blank"
					rel="noopener noreferrer"
					class:opacity-50={!selectedReservasi.customer?.noHp}
					class:pointer-events-none={!selectedReservasi.customer?.noHp}
				>
					<Button class="w-full bg-green-900 hover:bg-green-800 sm:w-auto">
						<MessageCircle size={18} />
						Kirim WhatsApp
					</Button>
				</a>
			</div>
		</div>
	</div>
{/if}
