<script lang='ts'>
	import { CircleAlert, UserRound } from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import Button from "$lib/components/ui/button/button.svelte";
	import DateRangePick from "$lib/components/DateRangePick.svelte";
	import { getLocalTimeZone, parseDate, today,  type DateValue } from "@internationalized/date";
	import { resolve } from "$app/paths";
	import { fmt } from "$lib";
	import { goto } from "$app/navigation";

    let{data}:PageProps = $props()

   	const todayDate = today(getLocalTimeZone());
     let errorMsg = $state<string | null>(null)

    let searchFilter = $derived<{ start: DateValue; end: DateValue }>({
      start: data.date?.tglMulai ? parseDate(data.date.tglMulai) : todayDate,
      end: data.date?.tglSelesai ? parseDate(data.date.tglSelesai) : todayDate.add({ days: 2 })
    });

       let durationInDays = $derived.by(() => {
           const s = searchFilter.start;
           const e = searchFilter.end;

           if (!s || !e) return 0;

           return Math.abs(e.compare(s)) + 1;
       });
       let totalHarga = $derived(Number(data.dataArmada?.hargaSewa ?? 0) * durationInDays);
       
  let isChecking = $state(false)

  function isSelectedDateUnavailable(start: DateValue, end: DateValue) {
    const selectedStart = start.compare(end) <= 0 ? start : end
    const selectedEnd = start.compare(end) <= 0 ? end : start

    return (data.availArmada ?? []).some((range) => {
      const unavailableStart = parseDate(String(range.tanggal_mulai).slice(0, 10))
      const unavailableEnd = parseDate(String(range.tanggal_selesai).slice(0, 10))

      return unavailableStart.compare(selectedEnd) <= 0 && unavailableEnd.compare(selectedStart) >= 0
    })
  }

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

    if (isSelectedDateUnavailable(start, end)) {
      errorMsg = "Armada pada tanggal tersebut sudah tidak tersedia. Silakan pilih tanggal lain."
      return
    }

    isChecking = true
    try {
      const res = await fetch(
        `/api/avail?armadaId=${data.dataArmada?.id}&tanggalMulai=${start.toString()}&tanggalSelesai=${end.toString()}`
      )
      const result = await res.json()
      if (!result.available) {
        errorMsg = "Tanggal yang dipilih sudah tidak tersedia. Silakan pilih tanggal lain."
        return
      }

      goto(resolve(`/checkout?armadaId=${data.dataArmada?.id}&tanggalMulai=${start.toString()}&tanggalSelesai=${end.toString()}`))
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
        <img src={data.dataArmada?.imageUrl} alt={data.dataArmada?.namaArmada} class="rounded-lg w-full object-cover"/>
      </section>

      <!-- Booking sidebar -->
      <section class="md:col-span-5 lg:col-span-4 flex flex-col gap-3">
        <div class="bg-white p-3 border rounded-md">
          <h3 class="font-semibold text-xl md:text-2xl">{data.dataArmada?.namaArmada}</h3>
          <div class="flex gap-2 items-center">
            <div class="mt-3 bg-gray-200 w-fit py-1 px-2 rounded-sm">
              <p class="text-xs font-semibold">{data.dataArmada?.platNomor}</p>
            </div>
            <div class="flex gap-1 items-center mt-3 bg-green-300 w-fit py-1 px-2 text-green-900 rounded-sm">
              <UserRound size={16}/>
              <p class="text-xs font-semibold">{data.dataArmada?.kapasitas} Orang</p>
            </div>
          </div>
          <div class="mt-2">
            <h3 class="font-semibold text-xl">{fmt(Number(data.dataArmada?.hargaSewa))}<span class="text-sm">/hari</span></h3>
          </div>
        </div>

        <div class="bg-white p-3 border rounded-md">
          <DateRangePick bind:value={searchFilter} unavailableDates={data?.availArmada}/>
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
            disabled={isChecking}
            class="hover:bg-green-700 bg-green-600 w-full mt-4"
            size="lg"
          >
            {isChecking ? 'Mengecek...' : 'Pesan Sekarang'}
          </Button>
        </div>
      </section>
    </div>
  </div>
</main>
