<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmt, formatDate } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		CalendarClock,
		Car,
		CheckCircle2,
		CircleDollarSign,
		Clock3,
		Frown,
		Package,
		Users,
		XCircle
	} from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type ReservasiItem = PageProps['data']['recentReservasi'][number];

	function getItemName(item: ReservasiItem) {
		return item.armada?.namaArmada ?? item.bundle?.namaBundle ?? 'Tidak tersedia';
	}

	function getItemType(item: ReservasiItem) {
		return item.armada ? 'Armada' : 'Bundle';
	}

	function getPaymentStatus(item: ReservasiItem) {
		return item.pembayaran?.[0]?.status ?? 'pending';
	}

	function getStatusClass(status: string | null) {
		if (status === 'lunas' || status === 'completed') return 'bg-green-100 text-green-800';
		if (status === 'dp' || status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'dibatalkan' || status === 'canceled') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-700';
	}
</script>

<section class="w-full p-5 lg:p-10">
	<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div>
			<p class="text-sm font-medium uppercase tracking-wide text-green-800">Dashboard</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
				Ringkasan Jeep Station Puncak
			</h1>
			<p class="mt-2 text-sm text-gray-500">
				Pantau armada, paket, customer, reservasi, dan pembayaran terbaru.
			</p>
		</div>
		<a href={resolve('/dashboard/reservasi')}>
			<Button class="bg-green-900 hover:bg-green-800">
				<CalendarClock size={18} />
				Lihat Reservasi
			</Button>
		</a>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-gray-500">Total Armada</p>
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<Car size={20} />
				</div>
			</div>
			<p class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
				{data.stats.totalArmada}
			</p>
			<p class="mt-1 text-sm text-gray-500">Unit armada aktif di database</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-gray-500">Paket Bundle</p>
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<Package size={20} />
				</div>
			</div>
			<p class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
				{data.stats.totalBundle}
			</p>
			<p class="mt-1 text-sm text-gray-500">Paket wisata yang tersedia</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-gray-500">Customer</p>
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<Users size={20} />
				</div>
			</div>
			<p class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
				{data.stats.totalCustomer}
			</p>
			<p class="mt-1 text-sm text-gray-500">Customer yang pernah reservasi</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-gray-500">Total Reservasi</p>
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<CalendarClock size={20} />
				</div>
			</div>
			<p class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
				{data.stats.totalReservasi}
			</p>
			<p class="mt-1 text-sm text-gray-500">Semua reservasi yang masuk</p>
		</div>
	</div>

	<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-3">
				<div class="rounded-md bg-yellow-100 p-2 text-yellow-800">
					<Clock3 size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Menunggu Pembayaran</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats.menungguPembayaran}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-3">
				<div class="rounded-md bg-yellow-100 p-2 text-yellow-800">
					<CircleDollarSign size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">DP</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats.dpReservasi}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-3">
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<CheckCircle2 size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Lunas</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats.lunasReservasi}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-3">
				<div class="rounded-md bg-red-100 p-2 text-red-800">
					<XCircle size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Dibatalkan</p>
					<p class="text-2xl font-semibold text-gray-900">{data.stats.dibatalkanReservasi}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-medium text-gray-500">Pembayaran Selesai</p>
					<p class="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
						{fmt(data.stats.totalPembayaran)}
					</p>
				</div>
				<div class="rounded-md bg-green-100 p-2 text-green-800">
					<CircleDollarSign size={22} />
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
		<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
			<div>
				<h2 class="text-lg font-semibold tracking-tight text-gray-900">Reservasi Terbaru</h2>
				<p class="text-sm text-gray-500">5 reservasi terakhir yang masuk ke sistem.</p>
			</div>
			<a href={resolve('/dashboard/reservasi')} class="text-sm font-medium text-green-800 hover:text-green-700">
				Lihat semua
			</a>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500">
				<thead class="bg-green-100 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3 font-medium">Customer</th>
						<th scope="col" class="px-6 py-3 font-medium">Reservasi</th>
						<th scope="col" class="px-6 py-3 font-medium">Tanggal</th>
						<th scope="col" class="px-6 py-3 font-medium">Total</th>
						<th scope="col" class="px-6 py-3 font-medium">Transaksi</th>
						<th scope="col" class="px-6 py-3 font-medium">Bayar</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-green-200 bg-white">
					{#if data.recentReservasi && data.recentReservasi.length > 0}
						{#each data.recentReservasi as reservasi (reservasi.id)}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="px-6 py-4">
									<p class="whitespace-nowrap font-medium text-gray-900">
										{reservasi.customer?.namaLengkap ?? '-'}
									</p>
									<p class="mt-1 text-xs text-gray-500">{reservasi.customer?.noHp ?? '-'}</p>
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
								<td class="whitespace-nowrap px-6 py-4">
									<span
										class={`rounded px-2 py-1 text-xs font-semibold capitalize ${getStatusClass(
											getPaymentStatus(reservasi)
										)}`}
									>
										{getPaymentStatus(reservasi)}
									</span>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="6" class="px-6 py-10 text-center">
								<div class="flex flex-col items-center justify-center space-y-2">
									<Frown size={40} color="#b5b5b5" />
									<p class="text-gray-500">Belum ada reservasi terbaru.</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</section>
