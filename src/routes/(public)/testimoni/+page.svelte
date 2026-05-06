<script lang="ts">
	import { Quote, Star, UsersRound } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function getInitial(name: string) {
		return name.trim().charAt(0).toUpperCase() || 'J';
	}

	function clampRating(rating: number) {
		return Math.max(0, Math.min(5, rating));
	}
</script>

<svelte:head>
	<title>Testimoni - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-10 px-5 md:mt-30 md:px-10">
	<div class="container mx-auto px-4 md:px-8 lg:px-20">
		<section class="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
			<div>
				<p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-800">Testimoni</p>
				<h1 class="mb-3 text-4xl font-bold tracking-tight text-green-950">
					Cerita Perjalanan Customer
				</h1>
				<p class="max-w-2xl text-gray-600">
					Lihat pengalaman customer yang sudah menjelajah Puncak bersama Jeep Station Puncak.
				</p>
			</div>

			<!-- <div class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
					<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-800">
						<UsersRound size={20} />
					</div>
					<p class="text-3xl font-semibold tracking-tight text-gray-900">{data.meta.totalData}</p>
					<p class="mt-1 text-sm text-gray-500">Total testimoni</p>
				</div>
				<div class="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
					<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-800">
						<Star size={20} />
					</div>
					<p class="text-3xl font-semibold tracking-tight text-gray-900">
						{data.meta.averageRating.toFixed(1)}
					</p>
					<p class="mt-1 text-sm text-gray-500">Rata-rata rating</p>
				</div>
			</div> -->
		</section>

		{#if data.dataTestimoni && data.dataTestimoni.length > 0}
			<section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.dataTestimoni as item (item.id)}
					<article class="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
						<div class="mb-5 flex items-start justify-between gap-4">
							<div class="flex items-center gap-3">
								<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-green-900 font-semibold text-white">
									{getInitial(item.nama)}
								</div>
								<div>
									<h2 class="font-semibold tracking-tight text-gray-950">{item.nama}</h2>
									<div class="mt-1 flex items-center gap-1 text-yellow-500">
										{#each Array(5) as _, i}
											<Star
												size={16}
												fill={i < clampRating(item.rating) ? 'currentColor' : 'none'}
												class={i < clampRating(item.rating) ? 'text-yellow-500' : 'text-gray-300'}
											/>
										{/each}
									</div>
								</div>
							</div>
							<Quote size={24} class="shrink-0 text-green-100" />
						</div>

						<p class="flex-1 text-sm leading-6 text-gray-600">"{item.komentar}"</p>
					</article>
				{/each}
			</section>
		{:else}
			<section class="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
					<Quote size={28} />
				</div>
				<h2 class="mb-2 text-xl font-semibold text-gray-700">Belum ada testimoni</h2>
				<p class="text-gray-500">Testimoni customer akan tampil di halaman ini.</p>
			</section>
		{/if}
	</div>
</main>
