<script lang='ts'>
	import { resolve } from "$app/paths";
	// import zekrom from '$lib/assets/zekrom.png';
	// import pikachu from '$lib/assets/pikachu.png';
	// import wailord from '$lib/assets/wailord.png';
	// import reshiram from '$lib/assets/reshiram.png';
	// import megazygrade from '$lib/assets/megazygrade.png';
	// import aurorus from '$lib/assets/aurorus.png';
</script>

<section class="px-10 mt-10">
    <div class="bg-indigo-300 p-8 md:p-12 rounded-xl border-[3px] border-gray-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-center">
        <div class="flex-1">
            <h1 class="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-950 uppercase leading-tight">
                PANGGILAN BUAT PARA PETARUNG!
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-700 font-medium">
                Di sini tempatnya para petarung sejati adu nasib nyari Moonbreon, Ijat Hitem, atau Pikachu Nungging.
                Kita ada Evolving Skies, 151, Brilliant Stars, sampai Prismatic
            </p>
            <a href={resolve("/product")}>
                <button class="text-xl rounded-md border-[3px] border-gray-950 px-8 py-4 font-bold cursor-pointer btn-neo uppercase">
                    Lihat Produk
                </button>
            </a>
        </div>
        <div class="flex-1 w-full border-[3px] border-gray-950 rounded-lg overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div class="relative w-full aspect-video">
                <iframe
                    class="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/PI19tjtpbN4?si=hbC6Q9gKOMUGHzi7"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>
</section>
