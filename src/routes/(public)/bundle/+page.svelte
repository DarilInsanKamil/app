<script lang="ts">
	import CardListBundle from '$lib/components/CardListBundle.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Paket Bundling - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-10 px-5 md:mt-30 md:px-10">
	<div class="container mx-auto px-4 md:px-8 lg:px-20">
		<div class="mb-8">
			<h1 class="mb-2 text-4xl font-bold text-green-950">Pilih Paket Bundling Anda</h1>
			<p class="text-gray-600">
				Temukan paket jeep yang praktis untuk perjalanan wisata Anda di Puncak
			</p>
		</div>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
			<form action="?search" class="flex flex-col gap-4 md:flex-row">
				<div class="flex-1">
					<label for="search" class="mb-2 block text-sm font-medium text-gray-700">
						Cari Bundle
					</label>
					<input
						id="search"
						type="text"
						placeholder="Cari berdasarkan nama bundle..."
						name="search"
						value={data.meta.search}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-950"
					/>
				</div>
				<div class="flex items-end">
					<button
						type="submit"
						class="w-full rounded-md bg-green-950 px-6 py-2 font-medium text-white transition-colors hover:bg-green-900 md:w-auto"
					>
						Cari
					</button>
				</div>
			</form>
		</div>

		<div class="mb-4">
			<p class="text-gray-600">
				Menampilkan <span class="font-semibold">{data?.dataBundle?.length || 0}</span> bundle
			</p>
		</div>

		{#if data?.dataBundle && data.dataBundle?.length > 0}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.dataBundle as bundle (bundle.id)}
					<CardListBundle {bundle} />
				{/each}
			</div>
		{:else}
			<div class="py-16 text-center">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 12H4m16 0a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2"
					/>
				</svg>
				<h3 class="mb-2 text-xl font-semibold text-gray-700">Tidak ada bundle ditemukan</h3>
				<p class="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
			</div>
		{/if}
	</div>
</main>
