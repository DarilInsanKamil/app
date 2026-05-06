<script lang='ts'>
	import { resolve } from "$app/paths";
	let {data = [] } = $props()

</script>


<section class="px-10">
    <div class="flex justify-between items-center mb-4 mt-10">
        <h2 class="font-semibold tracking-tight text-2xl">TOP HIT</h2>
        <a href={resolve('/product')} class="text-gray-400">See More</a>
    </div>
    <div class="flex gap-5 item-center">
        {#each data as tophit (tophit.id) }
        <div class="bg-blue-300 p-3 rounded-md border border-gray-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={tophit.image} alt={tophit.nama} width="250" class=" border border-gray-950 rounded-md" draggable="false"/>
            <h3 class="tracking-tight text-xl mt-2">{tophit.name}</h3>
            <h3 class="tracking-tight text-xl">{tophit.product.nama}</h3>
        </div>
        {/each}
    </div>
</section>
