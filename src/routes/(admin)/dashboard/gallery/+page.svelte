
<script lang='ts'>
    import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import Button from "$lib/components/ui/button/button.svelte";
	import { addToast } from "$lib/toast.svelte";
	import { Trash } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    let {data}:PageProps = $props();

</script>


<section class="lg:p-10 p-5">
  <a href={resolve("/dashboard/gallery/create")}>
  <Button class="bg-green-900 hover:bg-green-800">Tambah Data Gambar</Button>
  </a>
</section>

<section class="lg:px-10 px-5 grid lg:grid-cols-4 grid-cols-2 gap-4">
    {#if data.dataGallery && data.dataGallery.length > 0}
        {#each data.dataGallery as gallery (gallery.id)}
            <div class="relative bg-green-50 shadow-md p-3 rounded-md">
                <img src={gallery.imageUrl} alt={gallery.id}>
                <p>{gallery.deskripsi}</p>
                <form
                  class="mt-2"
                  action="?/delete"
                  method="POST"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      if (result.type === "success") {
                        addToast("Berhasil Menghapus data", 'success');
                      } else if (result.type === "failure") {
                        addToast(
                          (result.data as { message?: string })?.message || "Terjadi kesalahan",
                          'faild');
                      }
                      await update();
                    };
                  }}
                >
                  <input type="hidden" name="id" value={gallery.id} />
                  <Button type="submit" variant="destructive" size="sm">
                      <Trash size={20}/>
                      Hapus
                  </Button>
                </form>
            </div>
        {/each}
    {/if}
</section>
