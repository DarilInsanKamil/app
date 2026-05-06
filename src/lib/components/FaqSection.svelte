<script lang='ts'>
	import { ChevronDown } from '@lucide/svelte';

    const faqs = [
		{
			question: 'Bagaimana cara melakukan reservasi jeep?',
			answer:
				'Pilih tanggal mulai dan selesai di landing page, klik Pesan Sekarang, lalu pilih armada atau bundle yang tersedia sesuai kebutuhan perjalanan.'
		},
		{
			question: 'Apakah harga sewa sudah termasuk driver?',
			answer:
				'Detail fasilitas mengikuti paket atau armada yang dipilih. Kamu bisa melihat informasi lengkapnya di halaman detail sebelum melanjutkan reservasi.'
		},
		{
			question: 'Berapa kapasitas penumpang setiap jeep?',
			answer:
				'Kapasitas tersedia pada kartu armada. Pilih unit yang paling sesuai dengan jumlah peserta agar perjalanan tetap nyaman.'
		},
		{
			question: 'Apakah bisa memilih bundle wisata?',
			answer:
				'Bisa. Bagian Berbagai Bundle menampilkan paket yang menggabungkan beberapa fasilitas atau kebutuhan perjalanan dalam satu pilihan.'
		},
		{
			question: 'Apa yang harus dilakukan setelah pembayaran?',
			answer:
				'Setelah pembayaran berhasil, simpan informasi reservasi dan ikuti instruksi pada halaman konfirmasi untuk detail jadwal serta titik temu.'
		}
	];
    let openFaq = $state<number | null>(0);

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}
</script>

<section class="p-5 md:p-5 lg:p-10">
	<div class="mx-auto grid  gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
		<div>
			<p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-800">FAQ</p>
			<h2 class="mb-3 text-3xl font-bold tracking-tight text-gray-950">
				Pertanyaan yang Sering Ditanyakan
			</h2>
			<p class="text-base leading-7 text-gray-600">
				Temukan jawaban cepat sebelum memilih armada atau bundle untuk perjalanan di Jeep
				Station Puncak.
			</p>
		</div>

		<div class="space-y-3">
			{#each faqs as faq, i (faq.question)}
				<div class="overflow-hidden rounded-sm border bg-white shadow-sm">
					<button
						type="button"
						class="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-green-50"
						aria-expanded={openFaq === i}
						aria-controls={`faq-answer-${i}`}
						onclick={() => toggleFaq(i)}
					>
						<span class="text-base font-semibold tracking-tight text-gray-950">{faq.question}</span>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-green-100 text-green-900 transition-transform"
							class:rotate-180={openFaq === i}
						>
							<ChevronDown size={18} />
						</span>
					</button>

					{#if openFaq === i}
						<div id={`faq-answer-${i}`} class="border-t border-green-100 px-4 pb-4 pt-3">
							<p class="text-sm leading-6 text-gray-600">{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>