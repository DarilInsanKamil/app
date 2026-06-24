<script lang='ts'>
	import { CircleAlert } from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import Button from "$lib/components/ui/button/button.svelte";
	import DateRangePick from "$lib/components/DateRangePick.svelte";
	import { getLocalTimeZone, today,  type DateValue } from "@internationalized/date";
	import { fmt } from "$lib";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

    let { data }: PageProps = $props()
  let errorMsg = $state<string | null>(null)
  const todayDate = today(getLocalTimeZone());

  let searchFilter = $state<{ start: DateValue; end: DateValue }>({
    start: todayDate,
    end: todayDate.add({ days: 2 })
  });

  let durationInDays = $derived.by(() => {
    const s = searchFilter.start;
    const e = searchFilter.end;
    if (!s || !e) return 0;
    return Math.abs(e.compare(s)) + 1;
  });

  let totalHarga = $derived(Number(data.dataBundle?.hargaBundle ?? 0) * durationInDays);

   let isChecking = $state(false)

  async function handlePesan() {
    errorMsg = null

    const start = searchFilter.start
    const end = searchFilter.end

    if (!start || !end) {
      errorMsg = "Pilih tanggal terlebih dahulu"
      return
    }

    if (start.compare(todayDate) < 0) {
      errorMsg = "Tanggal mulai tidak boleh sebelum hari ini"
      return
    }

    isChecking = true
    try {
      const res = await fetch(
        `/api/avail?bundleId=${data.dataBundle?.id}&tanggalMulai=${start.toString()}&tanggalSelesai=${end.toString()}`
      )
      const result = await res.json()

      if (!result.available) {
        errorMsg = "Maaf, armada tidak cukup untuk bundle ini pada tanggal tersebut"
        return
      }

      goto(resolve(`/checkout?bundleId=${data.dataBundle?.id}&tanggalMulai=${start.toString()}&tanggalSelesai=${end.toString()}`))
    } catch {
      errorMsg = "Gagal mengecek ketersediaan, coba lagi"
    } finally {
      isChecking = false
    }
  }
</script>

<main class="mt-20 md:mt-28 px-4 md:px-10 pb-5">
  <div class="mx-auto max-w-6xl">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <!-- Image -->
      <section class="md:col-span-7 lg:col-span-8">
        <img src={data.dataBundle?.imageUrl} alt={data.dataBundle?.namaBundle} class="rounded-lg w-full object-cover"/>
      </section>

      <!-- Booking sidebar -->
      <section class="md:col-span-5 lg:col-span-4 flex flex-col gap-3">
        <div class="bg-white p-3 border rounded-md">
          <h3 class="font-semibold text-xl md:text-2xl">{data.dataBundle?.namaBundle}</h3>
          <div class="flex flex-col mt-2 gap-2">
            <div class="bg-gray-200 w-fit py-1 px-2 rounded-sm">
              <p class="text-xs font-semibold">Jumlah: {data.dataBundle?.jumlahUnit} unit</p>
            </div>
            <div class="flex flex-wrap gap-2 items-baseline">
              <p class="text-sm text-gray-600">Add-ons:</p>
              {#each data.dataBundle && data.dataBundle.addOns as addons, i(i)}
                <div class="bg-green-200 w-fit py-1 px-2 rounded-sm">
                  <p class="text-xs font-semibold">{addons}</p>
                </div>
              {/each}
            </div>
          </div>
          <div class="mt-2">
            <h3 class="font-semibold text-xl">{fmt(Number(data.dataBundle?.hargaBundle))}<span class="text-sm">/hari</span></h3>
          </div>
        </div>

        <div class="bg-white p-3 border rounded-md">
          <DateRangePick bind:value={searchFilter}/>
          {#if errorMsg}
            <div class="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
              <CircleAlert size={16} class="mt-0.5 shrink-0"/>
              <p>{errorMsg}</p>
            </div>
          {/if}
          <div class="mt-4">
            <p class="font-semibold text-sm"><span class="text-gray-700 font-normal">Durasi</span>: {durationInDays} hari</p>
            <p class="font-semibold text-xl mt-1">Total Biaya: {fmt(totalHarga)}</p>
          </div>
          <Button
            onclick={handlePesan}
            class="hover:bg-green-700 bg-green-600 w-full mt-4"
            size="lg"
          >
            {isChecking ? 'Mengecek ketersediaan...' : 'Pesan Sekarang'}
          </Button>
        </div>
      </section>
    </div>
  </div>
</main>
