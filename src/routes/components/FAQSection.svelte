<script lang="ts">
    let faqs = [
        { q: "Apakah produk yang dijual original?", a: "Ya, semua produk kartu dan bundle yang kami jual 100% original dan tersegel resmi sebelum di-brewek." },
        { q: "Bagaimana sistem pengirimannya?", a: "Setelah pack dibuka saat live, kartu hasil brewek akan dikemas dengan aman dan dikirimkan ke alamat yang kamu daftarkan." },
        { q: "Apakah bisa request tidak di-brewek (dikirim sealed)?", a: "Tentu bisa! Silakan beri catatan 'KIRIM SEALED' pada saat checkout jika kamu ingin membukanya sendiri di rumah." },
        { q: "Metode pembayaran apa saja yang tersedia?", a: "Kami menerima berbagai metode pembayaran digital yang umum digunakan dan aman." }
    ];
    let openIndex = $state<number | null>(null);

    function toggleFAQ(index: number) {
        if (openIndex === index) {
            openIndex = null;
        } else {
            openIndex = index;
        }
    }
</script>


<section class="px-10 bg-[radial-gradient(rgba(0, 0, 0, 0.15) 2px, transparent 2px)] bg-size-[30px_30px]">
    <div class="mb-8">
        <h2 class="font-bold tracking-tight text-4xl mb-4 uppercase text-gray-950">Frequently Asked Questions</h2>
        <p class="text-gray-800 text-xl font-medium">Pertanyaan yang sering ditanyakan oleh Brewekers.</p>
    </div>

    <div class="space-y-4 max-w-4xl">
        {#each faqs as faq,i (faq)}
        <div  class="bg-white border-[3px] border-gray-950 rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all">
            <button class="w-full text-left p-5 font-black text-xl flex justify-between items-center bg-gray-100 hover:bg-amber-300 transition-colors uppercase text-gray-950 cursor-pointer" onclick={() => toggleFAQ(i)}>
                <span>{faq.q}</span>
                <span class="text-3xl leading-none">{openIndex === i ? '-' : '+'}</span>
            </button>
            {#if openIndex === i}
            <div class="p-5 border-t-[3px] border-gray-950 bg-white">
                <p class="font-medium text-gray-900 text-lg">{faq.a}</p>
            </div>
            {/if}
        </div>
        {/each}
    </div>
</section>
