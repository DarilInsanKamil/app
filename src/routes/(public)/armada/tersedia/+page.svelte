<script lang='ts'>
	import { formatDate } from "$lib";
	import CardListArmada from "$lib/components/CardListArmada.svelte";
	import { CalendarDays, Frown } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    let {data}: PageProps = $props()
</script>

<svelte:head>
    <title>Armada Tersedia - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-10 px-5 md:mt-30 md:px-10">
  <div class="container mx-auto px-4 md:px-8 lg:px-20">
    <section class="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
      <div>
        <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-800">
          Armada Tersedia
        </p>
        <h1 class="mb-3 text-4xl font-bold tracking-tight text-green-950">
          Pilih Armada untuk Jadwal Anda
        </h1>
        <p class="max-w-2xl text-gray-600">
          Berikut daftar armada yang masih bisa dipesan pada rentang tanggal pilihan Anda.
        </p>
      </div> 
    </section>

    
        <p class="text-sm font-medium text-gray-500">Tanggal Reservasi</p>
        <p class="mt-1 font-semibold text-gray-900">
          {data.date.tanggalMulai ? formatDate(data.date.tanggalMulai) : '-'}
          <span class="font-normal text-gray-400">s/d</span>
          {data.date.tanggalSelesai ? formatDate(data.date.tanggalSelesai) : '-'}
        </p>

    <section class="mt-5">
        {#if data && data.dataArmada.length > 0}
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each data.dataArmada as armada (armada.id) }
              <CardListArmada {armada} href={`/armada/${armada.id}?tanggalMulai=${data.date.tanggalMulai}&tanggalSelesai=${data.date.tanggalSelesai}`}/>
            {/each}
          </div>
            {:else}
            <div class="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Frown size={28} />
              </div>
              <h2 class="mb-2 text-xl font-semibold text-gray-700">
                Armada pada tanggal tersebut tidak tersedia
              </h2>
              <p class="mx-auto max-w-md text-gray-500">
                Semua armada sudah terpakai pada rentang tanggal ini. Silakan kembali dan pilih tanggal lain.
              </p>
            </div>
        {/if}
    </section>
  </div>
</main>
