
<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import Button from "$lib/components/ui/button/button.svelte";
	import { addToast } from "$lib/toast.svelte";
	import { page } from '$app/state';
	import type { PageProps } from "./$types";
	import {Plus, PencilLine, Trash, Frown} from '@lucide/svelte/icons'
    let {data}: PageProps = $props()

   	const changePage = (newPage: number) => {
		const url = new URL(page.url);
		url.searchParams.set('page', newPage.toString());
		goto(url.toString(), { keepFocus: true });
	};
</script>

<section class="lg:p-10 p-5 w-full ">
  <section class="lg:flex inline justify-between">
    <form action="?search" class="lg:mb-0 mb-5">
      <input
        type="text"
        name="search"
        placeholder="Cari nama armada"
        class="border border-green-400 focus:outline-green-600 px-2 py-1 rounded-sm"
      />
      <Button size="sm" class="bg-green-900 hover:bg-green-800">Cari</Button>
    </form>
    <a href={resolve("/dashboard/armada/create")} >
        <Button class="bg-green-900 hover:bg-green-800"><Plus size={20} />Tambah Armada</Button>
    </a>
  </section>

  <div class="w-full overflow-hidden rounded-lg border border-gray-200 lg:mt-5 mt-2">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead class="bg-green-100 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium">No</th>
            <th scope="col" class="px-6 py-3 font-medium">Nama Armada</th>
            <th scope="col" class="px-6 py-3 font-medium">Plat Nomor</th>
            <th scope="col" class="px-6 py-3 font-medium">Harga Sewa</th>
            <th scope="col" class="px-6 py-3 font-medium">Kapasitas</th>
            <th scope="col" class="px-6 py-3 font-medium">Deskripsi</th>
            <th scope="col" class="px-6 py-3 font-medium">Action</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-green-200 bg-white">
          {#if data.dataArmada && data.dataArmada.length > 0}
            {#each data.dataArmada as armada, i (armada.id)}
              <tr class="hover:bg-gray-50 transition-colors">
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                >
                  {i + 1}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                >
                  {armada.namaArmada}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600"
                  >
                    {armada.platNomor}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-gray-700">
                  {armada.hargaSewa}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {armada.kapasitas} Orang
                </td>
                <td class="px-6 py-4">
                  <p
                    class="max-w-xs truncate text-gray-500"
                    title={armada.deskripsi}
                  >
                    {armada.deskripsi}
                  </p>
                </td>
                <td class="flex gap-2 px-6 py-4">
                  <a href={resolve(`/dashboard/armada/${armada.id}/edit`)}>
                    <Button size="icon-sm" variant="outline">
                      <PencilLine size={20} color="#5b9810" />
                    </Button>
                  </a>
                  <form
                    action="?/delete"
                    method="POST"
                    use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.type === "success") {
                          addToast("Berhasil Menghapus data", 'success');
                        } else if (result.type === "failure") {
                          addToast(
                            (result.data as { message?: string })?.message || "Terjadi kesalahan",
                            'fail');
                        }
                        await update();
                      };
                    }}
                  >
                    <input type="hidden" name="id" value={armada.id} />
                    <Button type="submit" variant="destructive" size="icon-sm">
                      <Trash size={20} />
                    </Button>
                  </form>
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="5" class="px-6 py-10 text-center">
                <div
                  class="flex flex-col items-center justify-center space-y-2"
                >
                  <Frown size={40} color="#b5b5b5" />
                  <p class="text-gray-500">Belum ada data armada tersedia.</p>
                </div>
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex justify-center">
  {#if data.meta.totalPages > 1}
		<div class="mt-4 flex items-center gap-2">
			<Button
			    variant="outline"
				disabled={data.meta.currentPage === 1}
				onclick={() => changePage(data.meta.currentPage - 1)}
			>
				Sebelumnya
			</Button>

			<span>
				Halaman {data.meta.currentPage} dari {data.meta.totalPages}
			</span>

			<Button
			    variant="outline"
				disabled={data.meta.currentPage === data.meta.totalPages}
				onclick={() => changePage(data.meta.currentPage + 1)}
			>
				Selanjutnya
			</Button>
		</div>
	{/if}
  </div>
</section>
