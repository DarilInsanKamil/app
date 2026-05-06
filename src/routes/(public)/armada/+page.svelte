<script lang="ts">
	import CardListArmada from '$lib/components/CardListArmada.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>
<svelte:head>
    <title>List Armada - Jeep Station Puncak</title>
</svelte:head>
<main class="md:mt-30 mt-10 md:px-10 px-5">
    <div class="container mx-auto px-4 md:px-8 lg:px-20">
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-green-950 mb-2">
                Pilih Armada Jeep Anda
            </h1>
            <p class="text-gray-600">
                Temukan jeep yang sempurna untuk petualangan Anda di Puncak
            </p>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <form action="?search" class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                        Cari Armada
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Cari berdasarkan nama..."
                        name="search"
                        value={data.meta.search}
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-950 focus:border-transparent"
                    />
                </div>
                <!-- <div class="md:w-48">
                    <label for="kapasitas" class="block text-sm font-medium text-gray-700 mb-2">
                        Kapasitas
                    </label>
                    <select
                        id="kapasitas"
                        name="kapasitas"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-950 focus:border-transparent"
                    >
                        <option value="">Semua</option>
                        <option value="4">4 orang</option>
                        <option value="5">5 orang</option>
                        <option value="6">6 orang</option>
                        <option value="7">7 orang</option>
                        <option value="8">8+ orang</option>
                    </select>
                </div> -->
                <div class="flex items-end">
                    <button
                        type="submit"
                        class="w-full md:w-auto px-6 py-2 bg-green-950 text-white rounded-md hover:bg-green-900 transition-colors font-medium"
                    >
                        Cari
                    </button>
                </div>
            </form>
        </div>

        <!-- Results Count -->
        <div class="mb-4">
            <p class="text-gray-600">
                Menampilkan <span class="font-semibold">{data?.dataArmada?.length || 0}</span> armada
            </p>
        </div>

        <!-- Armada Grid -->
        {#if data?.dataArmada && data.dataArmada?.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each data.dataArmada as armada (armada.id)}
                    <CardListArmada armada={armada} href={`/armada/${armada.id}`} />
                {/each}
            </div>
        {:else}
            <div class="text-center py-16">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Tidak ada armada ditemukan</h3>
                <p class="text-gray-500">Coba ubah filter pencarian Anda</p>
            </div>
        {/if}
    </div>
</main>
