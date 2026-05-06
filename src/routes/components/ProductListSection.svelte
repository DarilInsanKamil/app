<script lang='ts'>
	import { resolve } from "$app/paths";
	import { formatter } from "$lib";

    let { data = [] } = $props();
</script>


<section class="px-10">
    <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold tracking-tight text-2xl">Katalog Produk</h2>
        <a href={resolve('/product')} class="text-gray-400">See More</a>
    </div>
    <div class="flex gap-5 item-center">
        {#each data as product (product.id) }
        <div class="bg-blue-300 p-3 rounded-md border border-gray-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={product.image} alt={product.nama} height="250" width="250" class="border border-gray-950 rounded-md" draggable="false"/>
            <h3 class="tracking-tight text-xl mt-2">{product.nama}</h3>
            <p class="text-red-500 font-semibold bg-red-200 w-fit px-2 rounded-sm text-sm my-1.5">Tersisa {product.stok}</p>
            <h3 class="font-semibold tracking-tight text-xl">{formatter.format(product.price)}</h3>
            <a href={resolve(`/product/${product.slug}`)}>
                <button class="rounded-md border border-gray-950 bg-amber-300 w-full mt-3 p-2 font-semibold cursor-pointer hover:bg-amber-400 transition-all">Beli Sekarang</button>
            </a>
        </div>
        {/each}
    </div>
</section>
