<script lang='ts'>
    import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import { addToast } from "$lib/toast.svelte";

    let previewUrl = $state<string|null>(null);
    let addOns = $state<string[]>([]);
    let inputAddOn = $state("")
    let isLoading = $state(false)

    const handleImageChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if(input.files && input.files[0]) {
        const file = input.files[0];
        previewUrl = URL.createObjectURL(file)
      } else {
        previewUrl = null
      }
    }


    const handleAddOn = (e: KeyboardEvent | MouseEvent) => {
      if((e instanceof KeyboardEvent && e.key === 'Enter') || e.type === 'click'){
        e.preventDefault()
        const value = inputAddOn.trim()

        if(value && !addOns.includes(value)) {
          addOns = [...addOns, value]
          inputAddOn = ""
        }
    }
    }
    const removeAddOn = (index: number) => {
      addOns = addOns.filter((_,i) => i !== index)
    }
</script>

<div class="py-5 lg:px-10 p-5">
    <a href={resolve("/dashboard/armada")} class="flex gap-2 mb-5">
        Kembali
    </a>
</div>


<section class="lg:p-10 p-5 w-full">
    <form action="?/upload"
        method="POST"
        class="grid lg:gap-5 gap-3 lg:w-1/2 w-full"
        enctype="multipart/form-data"
        use:enhance={()=> {
      return async({result, update}) => {
        isLoading = true
        if(result.type === 'success') {
          addToast('Berhasil menambah data bundle', 'success')
          isLoading = false
        } else if (result.type === 'failure') {
          addToast((result.data as { message?: string })?.message || "Terjadi kesalahan", 'fail')
        }
        await update()
      }
    }}>
        <div>
            <label for="image" class="font-semibold">
                Gambar Bundle *
            </label>
            <br>
            <input
                type="file"
                name="image"
                accept="image/*"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                onchange={handleImageChange}
                required
            >
            {#if previewUrl}
                <p class="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                    src={previewUrl}
                    alt="Preview bundle"
                    class="w-full max-w-xs h-48 object-cover rounded-md border border-gray-300"
                >
            {/if}
        </div>
        <div>
            <label for="namaBundle" class="font-semibold">
                Nama Bundle *
            </label>
            <br>
            <input
                type="text"
                name="namaBundle"
                placeholder="Masukan nama bundle"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                required
            >
        </div>
        <div>
            <label for="hargaBundle" class="font-semibold">
                Harga Bundle *
            </label>
            <br>
            <input
                type="text"
                name="hargaBundle"
                placeholder="Masukan harga bundle"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                required
            >
        </div>
        <div>
            <label for="jumlahUnit" class="font-semibold">
                Jumlah Unit *
            </label>
            <br>
            <input
                type="number"
                name="jumlahUnit"
                placeholder="Masukan jumlah jumlah_unit"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                required
            >
        </div>
        <div>
            <label for="platNomoe" class="font-semibold">
                Fasilitas / AddOns *
            </label>
            <br>
            <input
                type="text"
                placeholder="Contoh: Makan Siang, Tiket Masuk (Tekan Enter)"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                bind:value={inputAddOn}
                onkeydown={handleAddOn}
            >
            <button type="button" onclick={handleAddOn} class='mt-2'>Tambah</button>
            {#if addOns.length > 0}
                <div class="flex flex-wrap gap-2 mt-2">
                    {#each addOns as item, i(i)}
                        <span class="text-gray-800 bg-amber-100 text-sm px-2 py-1 rounded-sm flex items-center gap-1 border font-semibold">
                            {item}
                            <button
                                type="button"
                                onclick={() => removeAddOn(i)}
                                class="hover:text-red-500"
                            >
                                X
                            </button>
                        </span>
                    {/each}
                </div>
            {/if}
            <input type="hidden" name="addOns" value={JSON.stringify(addOns)} />
        </div>
        <div>
            <label for="deskripsi" class="font-semibold">
                Deskripsi *
            </label>
            <br>
            <textarea name="deskripsi" placeholder="Masuk deskrirpsi armada" class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md" required></textarea>
        </div>
        <button type='submit' class="bg-green-900 hover:bg-green-800" disabled={isLoading}>Upload Data Bundle</button>
    </form>
</section>
