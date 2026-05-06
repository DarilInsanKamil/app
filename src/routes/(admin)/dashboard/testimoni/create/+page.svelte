<script lang='ts'>
    import { enhance } from "$app/forms";
	import { addToast } from "$lib/toast.svelte";

</script>


<section class="lg:p-10 p-5 w-full ">
    <form action="?/upload" method="POST" class="grid lg:gap-5 gap-3 lg:w-1/2 w-full" use:enhance={() => {
      return async({result, update}) => {
        if(result.type === 'success') {
          addToast('Berhasil Menambah data', 'success')
        } else if (result.type === 'failure') {
          addToast((result.data as { message?: string })?.message || "Terjadi kesalahan", 'fail')
        }
        await update()
      }
    }}>
        <div>
            <label for="nama" class="font-semibold">
                Nama *
            </label>
            <br>
            <input
                type="text"
                name="nama"
                placeholder="Masukan nama"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                required
            >
        </div>
        <div>
            <label for="rating" class="font-semibold">
                Rating *
            </label>
            <br>
            <input
                type="number"
                name="rating"
                placeholder="Masukan rating"
                class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
                required
            >
        </div>
        <div>
            <label for="komentar" class="font-semibold">
                Komentar *
            </label>
            <br>
            <textarea name="komentar" placeholder="Masukan Komentar" class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md" required></textarea>
        </div>
        <button type='submit' class="bg-green-900 hover:bg-green-800">Upload Data Testimoni</button>
    </form>
</section>
