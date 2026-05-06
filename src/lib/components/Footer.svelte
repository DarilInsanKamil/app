<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Mail,
		MapPin,
		Phone,
		Send,
	} from '@lucide/svelte';

	const year = new Date().getFullYear();

	const quickLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Paket Bundling', href: '/bundle' },
		{ label: 'List Armada', href: '/armada' },
		{ label: 'Testimoni', href: '/testimoni' },
		{ label: 'Gallery', href: '/gallery' }
	];
</script>

<footer class="mt-16 border-t border-green-100 bg-white">
	<div class="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_1fr] lg:px-10">
		<div>
			<div class="mb-4 flex items-center gap-3">
				<div class="flex h-11 w-11 items-center justify-center rounded-md bg-green-900 text-white">
					<MapPin size={22} />
				</div>
				<div>
					<h2 class="text-xl font-bold tracking-tight text-gray-950">Jeep Station Puncak</h2>
					<p class="text-sm text-gray-500">Sewa dan reservasi jeep cepat di Puncak</p>
				</div>
			</div>
			<p class="max-w-md text-sm leading-6 text-gray-600">
				Pilih armada, atur tanggal, dan nikmati perjalanan wisata Puncak dengan proses
				reservasi yang praktis.
			</p>
		</div>

		<div>
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-950">Navigasi</h3>
			<ul class="grid gap-3 text-sm text-gray-600">
				{#each quickLinks as link (link.href)}
					<li>
						<a href={resolve(link.href)} class="transition-colors hover:text-green-800">
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-950">Hubungi Kami</h3>
			<div class="grid gap-3 text-sm text-gray-600">
				<a
					href="https://wa.me/6281234567890"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-3 transition-colors hover:text-green-800"
				>
					<Phone size={18} class="shrink-0 text-green-800" />
					<span>+62 812-3456-7890</span>
				</a>
				<a
					href="mailto:info@jeepstationpuncak.com"
					class="flex items-center gap-3 transition-colors hover:text-green-800"
				>
					<Mail size={18} class="shrink-0 text-green-800" />
					<span>info@jeepstationpuncak.com</span>
				</a>
				<p class="flex items-start gap-3">
					<MapPin size={18} class="mt-0.5 shrink-0 text-green-800" />
					<span>Puncak, Bogor, Jawa Barat</span>
				</p>
			</div>

			<div class="mt-5 flex gap-3">
				<a
					href="https://instagram.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Instagram Jeep Station Puncak"
					class="flex h-10 w-10 items-center justify-center rounded-md border bg-white text-gray-700 transition hover:border-green-800 hover:text-green-800"
				>
					<!-- <Instagram size={18} /> -->
					 Instagram
				</a>
				<a
					href="https://facebook.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Facebook Jeep Station Puncak"
					class="flex h-10 w-10 items-center justify-center rounded-md border bg-white text-gray-700 transition hover:border-green-800 hover:text-green-800"
				>
					<!-- <Facebook size={18} /> -->
					 Facebook
				</a>
				<a
					href="https://youtube.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="YouTube Jeep Station Puncak"
					class="flex h-10 w-10 items-center justify-center rounded-md border bg-white text-gray-700 transition hover:border-green-800 hover:text-green-800"
				>
					<!-- <Youtube size={18} /> -->
					 Youtube
				</a>
				<a
					href="https://t.me"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Telegram Jeep Station Puncak"
					class="flex h-10 w-10 items-center justify-center rounded-md border bg-white text-gray-700 transition hover:border-green-800 hover:text-green-800"
				>
					<Send size={18} />
				</a>
			</div>
		</div>
	</div>

	<div class="border-t border-green-100 px-5 py-4 text-center text-sm text-gray-500">
		&copy; {year} Jeep Station Puncak. All rights reserved.
	</div>
</footer>
