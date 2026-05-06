<script lang="ts">
	import { fmt } from "$lib";
 let { totalHarga, metodeBayar = $bindable('dp') } = $props()

  let nominalBayar = $derived(
    metodeBayar === 'dp' ? totalHarga * 0.5 : totalHarga
  )

  let sisaPelunasan = $derived(totalHarga - nominalBayar)


</script>
<div>
                <div class="flex bg-muted rounded-xl p-1 border">
                <input type="hidden" name="nominalBayar" value={nominalBayar} />
                    <button
      onclick={() => metodeBayar = 'dp'}
      class={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
          metodeBayar === 'dp'
          ? 'bg-background text-foreground border shadow-sm'
          : 'text-muted-foreground'
        }`}
    >
      DP dulu
    </button>
    <button
      onclick={() => metodeBayar = 'lunas'}
      class={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
          metodeBayar === 'lunas'
          ? 'bg-background text-foreground border shadow-sm'
          : 'text-muted-foreground'
        }`}
    >
      Bayar lunas
    </button>
</div>

<div class="mt-3 border rounded-xl overflow-hidden">
    <div class="flex justify-between px-4 py-3 border-b text-sm">
        <span class="text-muted-foreground">Total harga</span>
        <span class="font-medium">{fmt(totalHarga)}</span>
    </div>

    {#if metodeBayar === 'dp'}
    <div class="flex justify-between px-4 py-3 border-b text-sm">
        <span class="text-muted-foreground">Bayar DP (50%)</span>
        <span class="font-medium">{fmt(nominalBayar)}</span>
    </div>
    <div class="flex justify-between px-4 py-3 border-b text-sm">
        <span class="text-muted-foreground">Sisa pelunasan</span>
        <span class="text-muted-foreground">{fmt(sisaPelunasan)}</span>
    </div>
    {/if}

    <div class="flex justify-between px-4 py-3 bg-muted text-sm">
        <span class="font-medium">Bayar sekarang</span>
      <span class="text-lg font-medium">{fmt(nominalBayar)}</span>
    </div>
</div>

{#if metodeBayar === 'dp'}
<p class="text-xs text-muted-foreground mt-2 px-1">
    Sisa pembayaran dilunasi sebelum tanggal keberangkatan.
</p>
{/if}

</div>
