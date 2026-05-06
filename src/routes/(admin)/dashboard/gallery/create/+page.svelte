<script lang='ts'>
    import { enhance } from "$app/forms";
	import { addToast } from "$lib/toast.svelte";

    let previewUrl = $state<string | null>(null);
    const handleImageChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if(input.files && input.files[0]) {
        const file = input.files[0];
        previewUrl = URL.createObjectURL(file)
      } else {
        previewUrl = null
      }
    }
</script>

<section class="lg:p-10 p-5  w-full">
<form action="?/upload" method="POST" class="grid lg:gap-5 gap-3 lg:w-1/2 w-full" enctype="multipart/form-data" use:enhance={() => {
  return async({result, update}) => {
    if(result.type === 'success') {
      addToast('Berhasil Menambah data', 'success')
    } else if (result.type === 'failure') {
      addToast((result.data as { message?: string })?.message || "Terjadi kesalahan", 'fail')
    }
    await update({
      reset: true
    })
  }
}}>
    <div>
        <label for="image" class="font-semibold">
            Upload Gambar *
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
                alt="Preview armada"
                class="w-full max-w-xs h-48 object-cover rounded-md border border-gray-300"
            >
        {/if}
        <div class="mt-3 mb-5">
            <label for="deskripsi" class="font-semibold">
                Deskripsi *
            </label>
            <br>
            <textarea name="deskripsi" placeholder="Masuk deskrirpsi armada" class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md" required></textarea>
        </div>
        <button type='submit' class="bg-green-900 hover:bg-green-800">Upload Data Gallery</button>
    </div>
</form>
</section>
