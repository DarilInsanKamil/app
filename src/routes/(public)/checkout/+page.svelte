<script lang="ts">
  import { enhance } from "$app/forms";
  import TogglePayment from "$lib/components/TogglePayment.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { UserRound } from "@lucide/svelte";
  import type { PageProps } from "./$types";
  import { fmt } from "$lib";
  import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

  let { data, form }: PageProps = $props()
  let isLoading = $state(false)
  let metodeBayar = $state<'dp' | 'lunas'>('dp')

 
 function loadSnapScript(clientKey: string): Promise<void> {
    return new Promise((resolve) => {
      if (document.getElementById('snap-script')) return resolve();

      const script = document.createElement('script');
      script.id = 'snap-script';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', clientKey);
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
</script>

<section class="grid grid-cols-1 md:grid-cols-12 px-4 md:px-20 mt-20 md:mt-28 gap-4 md:gap-5 pb-8">
  <div class="col-span-1 md:col-span-6">
    {#if data.tipe === 'armada'}
      <div>
        <img src={data.dataArmada.imageUrl} alt={data.dataArmada.namaArmada} class="rounded-md"/>
        <div class="border-t border-l border-r rounded-t-md mt-3 p-2">
          <h3 class="font-semibold text-2xl mb-1">{data.dataArmada.namaArmada}</h3>
          <div class="flex gap-2 items-center mb-2">
            <div class="bg-gray-200 w-fit py-1 px-2 rounded-sm">
              <p class="text-xs font-semibold">{data.dataArmada.platNomor}</p>
            </div>
            <div class="flex gap-1 items-center bg-green-300 w-fit py-1 px-2 text-green-900 rounded-sm">
              <UserRound size={16}/>
              <p class="text-xs font-semibold">{data.dataArmada.kapasitas} Orang</p>
            </div>
          </div>
        </div>
        <div class="bg-muted p-2 border-t rounded-b-md">
          <p class="text-gray-700 my-1">Durasi peminjaman <span class="font-semibold">{data.durasi} hari</span></p>
          <h3 class="font-semibold text-2xl">Total {fmt(Number(data.totalHarga))}</h3>
        </div>
      </div>
    {:else if data.tipe === 'bundle'}
        <img src={data.dataBundle.imageUrl} alt={data.dataBundle.namaBundle} class="rounded-md"/>
    {/if}
  </div>

  <div class="col-span-1 md:col-span-6 border p-3 rounded-md">
    <form
      action="?/upload"
      method="POST"
      use:enhance={() => {
        isLoading = true
       return async ({result}) => {
    if (result.type === 'success') {
      isLoading=false
      console.log('Hello world')
      const { transactionToken } = result.data;
      console.log(result.data)

      await loadSnapScript(data.clientKey);

      window.snap.pay(transactionToken, {
        onSuccess: (r) => goto(resolve('/armada')),
        onPending: (r) => console.log('pending', r),
        onError: (r) => console.error('error', r),
        onClose: () => console.log('ditutup'),
      });
    }
  }
      }}
    >
      <!-- ✅ Hidden inputs berdasarkan tipe -->
      {#if data.tipe === 'armada'}
        <input type="hidden" name="armadaId" value={data.dataArmada.id} />
      {:else}
        <input type="hidden" name="bundleId" value={data.dataBundle.id} />
      {/if}
      <input type="hidden" name="tanggalMulai" value={data.tanggalMulai} />
      <input type="hidden" name="tanggalSelesai" value={data.tanggalSelesai} />

      <input type="hidden" name="metodeBayar" value={metodeBayar} />

      <div>
        <label for="alamatJemput" class="font-semibold">Alamat pengambilan armada *</label>
        <br />
        <textarea
          name="alamatJemput"
          cols="4"
          placeholder="Masukan alamat pengambilan armada"
          class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
          required
        ></textarea>
      </div>

      <div class="mt-2">
        <h3 class="font-semibold text-xl tracking-tight mb-2">Pilih Pembayaran:</h3>
        <TogglePayment totalHarga={Number(data.totalHarga)} bind:metodeBayar />
      </div>

      <div class="border-t mt-3"></div>
      <h3 class="font-semibold tracking-tight text-xl my-3">Form Reservasi Customer</h3>

      <div class="mt-2">
        <label for="nama" class="font-semibold">Nama Lengkap *</label>
        <br />
        <input type="text" name="nama" placeholder="Masukan nama lengkap"
          class="border mt-2 w-full p-2 rounded-md" required />
      </div>
      <div class="mt-2">
        <label for="noHp" class="font-semibold">Nomor Handphone (whatsapp) *</label>
        <br />
        <input type="text" name="noHp" placeholder="Masukan nomor handphone"
          class="border mt-2 w-full p-2 rounded-md" required />
      </div>
      <div class="mt-2">
        <label for="email" class="font-semibold">Masukan Email *</label>
        <br />
        <input type="email" name="email" placeholder="Masukan email"
          class="border mt-2 w-full p-2 rounded-md" required />
      </div>
      <div class="mt-2">
        <label for="alamat" class="font-semibold">Alamat *</label>
        <br />
        <input type="text" name="alamat" placeholder="Masukan alamat"
          class="border mt-2 w-full p-2 rounded-md" required />
      </div>

      <Button class="w-full mt-4" size="lg" type="submit" disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Konfirmasi Reservasi'}
      </Button>
    </form>
  </div>
</section>