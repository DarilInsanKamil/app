<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from '$app/state';
	import Button from "$lib/components/ui/button/button.svelte";
	import { addToast } from "$lib/toast.svelte";
	import type { PageProps } from "./$types";
	import { Frown, Mail, MapPin, Phone, Search, Trash, UserRound } from '@lucide/svelte/icons';

	let { data }: PageProps = $props();

	const changePage = (newPage: number) => {
		const url = new URL(page.url);
		url.searchParams.set('page', newPage.toString());
		goto(url.toString(), { keepFocus: true });
	};
</script>

<svelte:head>
	<title>Customer - Dashboard Admin</title>
</svelte:head>

<section class="p-5 lg:p-10 w-full">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight text-gray-900">Manajemen Customer</h1>
		<p class="mt-1 text-sm text-gray-500">
			Menampilkan <span class="font-semibold text-gray-700">{data.meta.totalData}</span> customer terdaftar
		</p>
	</div>

	<!-- Search bar -->
	<section class="flex flex-col sm:flex-row gap-3 justify-between mb-4">
		<form action="?search" class="flex gap-2">
			<div class="relative">
				<Search size={16} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					name="search"
					placeholder="Cari nama, email, no HP..."
					value={data.meta.search}
					class="border border-green-400 focus:outline-green-600 pl-8 pr-3 py-1.5 rounded-sm text-sm w-64"
				/>
			</div>
			<Button size="sm" class="bg-green-900 hover:bg-green-800">Cari</Button>
		</form>
	</section>

	<!-- Table -->
	<div class="w-full overflow-hidden rounded-lg border border-gray-200">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500">
				<thead class="bg-green-100 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="px-6 py-3 font-medium">No</th>
						<th scope="col" class="px-6 py-3 font-medium">Nama Lengkap</th>
						<th scope="col" class="px-6 py-3 font-medium">Email</th>
						<th scope="col" class="px-6 py-3 font-medium">No HP</th>
						<th scope="col" class="px-6 py-3 font-medium">Alamat</th>
						<th scope="col" class="px-6 py-3 font-medium">Terdaftar</th>
						<th scope="col" class="px-6 py-3 font-medium">Action</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-green-200 bg-white">
					{#if data.dataCustomer && data.dataCustomer.length > 0}
						{#each data.dataCustomer as cust, i (cust.id)}
							<tr class="hover:bg-gray-50 transition-colors">
								<!-- No -->
								<td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
									{(data.meta.currentPage - 1) * data.meta.limit + i + 1}
								</td>

								<!-- Nama -->
								<td class="whitespace-nowrap px-6 py-4">
									<div class="flex items-center gap-2">
										<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 text-xs font-semibold">
											{cust.namaLengkap.trim().charAt(0).toUpperCase()}
										</div>
										<span class="font-medium text-gray-900">{cust.namaLengkap}</span>
									</div>
								</td>

								<!-- Email -->
								<td class="whitespace-nowrap px-6 py-4">
									{#if cust.email}
										<div class="flex items-center gap-1.5 text-gray-600">
											<Mail size={14} class="shrink-0 text-gray-400" />
											<span>{cust.email}</span>
										</div>
									{:else}
										<span class="text-gray-400 italic">-</span>
									{/if}
								</td>

								<!-- No HP -->
								<td class="whitespace-nowrap px-6 py-4">
									<div class="flex items-center gap-1.5 text-gray-600">
										<Phone size={14} class="shrink-0 text-gray-400" />
										<span>{cust.noHp}</span>
									</div>
								</td>

								<!-- Alamat -->
								<td class="px-6 py-4">
									{#if cust.alamat}
										<div class="flex items-start gap-1.5 text-gray-600">
											<MapPin size={14} class="shrink-0 mt-0.5 text-gray-400" />
											<p class="max-w-[200px] truncate" title={cust.alamat}>{cust.alamat}</p>
										</div>
									{:else}
										<span class="text-gray-400 italic">-</span>
									{/if}
								</td>

								<!-- Created At -->
								<td class="whitespace-nowrap px-6 py-4 text-gray-500 text-xs">
									{new Date(cust.createdAt).toLocaleDateString('id-ID', {
										day: '2-digit',
										month: 'short',
										year: 'numeric'
									})}
								</td>

								<!-- Action -->
								<td class="px-6 py-4">
									<form
										action="?/delete"
										method="POST"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type === "success") {
													addToast("Berhasil menghapus customer", 'success');
												} else if (result.type === "failure") {
													addToast(
														(result.data as { message?: string })?.message || "Terjadi kesalahan",
														'fail'
													);
												}
												await update();
											};
										}}
									>
										<input type="hidden" name="id" value={cust.id} />
										<Button type="submit" variant="destructive" size="icon-sm">
											<Trash size={16} />
										</Button>
									</form>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-16 text-center">
								<div class="flex flex-col items-center justify-center space-y-2">
									<Frown size={40} color="#b5b5b5" />
									<p class="text-gray-500">
										{data.meta.search
											? `Tidak ada customer yang cocok dengan "${data.meta.search}".`
											: 'Belum ada data customer tersedia.'}
									</p>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Pagination -->
	<div class="flex justify-center mt-4">
		{#if data.meta.totalPages > 1}
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					disabled={data.meta.currentPage === 1}
					onclick={() => changePage(data.meta.currentPage - 1)}
				>
					Sebelumnya
				</Button>

				<span class="text-sm text-gray-600">
					Halaman {data.meta.currentPage} dari {data.meta.totalPages}
				</span>

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
