<script lang="ts">
	import CardListArmada from '$lib/components/CardListArmada.svelte';
	import CardListBundle from '$lib/components/CardListBundle.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	let { data } = $props();
	const todayDate = today(getLocalTimeZone());

	let searchFilter = $state({
		start: todayDate,
		end: todayDate.add({ days: 2 })
	});

</script>

<HeroSection searchFilter={searchFilter} />

<section class="p-5 -mt-10 md:p-5 lg:p-10">
	<h1 class="mb-4 text-3xl font-bold tracking-tight">Armada Tersedia</h1>
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
		{#if data?.armada && data?.armada.length > 0}
			{#each data?.armada as armada (armada.id)}
				<CardListArmada {armada} href={`/armada/${armada.id}`} />
			{/each}
		{:else}
			<p>Data tidak ada</p>
		{/if}
	</div>
</section>

<section class="p-5 -mt-10 md:p-5 lg:p-10">
	<h1 class="mb-4 text-3xl font-bold tracking-tight">Berbagai Bundle</h1>
	<div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
		{#if data?.bundle && data?.bundle.length > 0}
			{#each data?.bundle as bundle (bundle.id)}
				<CardListBundle {bundle} />
			{/each}
		{:else}
			<p>Data tidak ada</p>
		{/if}
	</div>
</section>

<FaqSection/>