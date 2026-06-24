<script lang='ts'>
	import { resolve } from '$app/paths';
    import background from '$lib/assets/background.png'
	import { CircleAlert } from '@lucide/svelte';
	import DateRangePick from './DateRangePick.svelte';
	import Button from './ui/button/button.svelte';
	import { goto } from '$app/navigation';
	let{searchFilter} = $props()

	let errorMsg = $state<string | null>(null)

 function handlePesan(){
      errorMsg = null
      const start = searchFilter.start
      const end = searchFilter.end

      if (!start || !end) {
         errorMsg = "Pilih tanggal mulai dan selesai terlebih dahulu."
         return
       }

        goto(resolve(`/armada/tersedia?tanggalMulai=${searchFilter.start}&tanggalSelesai=${searchFilter.end}`))
    }
</script>

<section class="relative w-full">
  <div class="relative w-full overflow-hidden">
    <img
      src={background}
      alt="Hero background"
      class="w-full object-cover mask-b-from-85% mask-b-to-90% min-h-[420px] md:min-h-0"
      fetchpriority="high"
      loading="eager"
      height="120px"
    />

    <div class="absolute bottom-6 md:bottom-16 lg:bottom-24 left-4 right-4 md:left-10 lg:left-20 md:right-10 lg:right-20">
      <h1
        class="max-w-2xl text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white tracking-tight mb-3"
      >
        Sewa dan Reservasi Cepat<br />
        di Jeep Station Puncak
      </h1>
      <section class="bg-white p-3 md:p-4 rounded-md flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <div class="flex-1">
          <DateRangePick bind:value={searchFilter}/>
        </div>

        <Button
               onclick={handlePesan}
               size="lg"
               variant="outline"
               class="w-full sm:w-auto"
             >
               Pesan Sekarang
        </Button>
      </section>
        {#if errorMsg}
               <div class="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
                 <CircleAlert size={16} class="mt-0.5 shrink-0"/>
                 <p>{errorMsg}</p>
               </div>
        {/if}
    </div>
  </div>
</section>
