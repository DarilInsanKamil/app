<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Lock, Mail, UserRound, UserPlus } from '@lucide/svelte';
	import type { ActionData } from './$types';

	let { form }: { form?: ActionData } = $props();
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Register - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-24 flex min-h-[calc(100vh-6rem)] items-center justify-center px-5 py-12">
	<section class="grid w-full max-w-5xl overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
		<div class="p-6 md:p-10">
			<div class="mb-8">
				<p class="text-sm font-medium uppercase tracking-wide text-green-800">Register</p>
				<h1 class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Buat akun baru</h1>
				<p class="mt-2 text-sm text-gray-500">
					Akun baru akan terdaftar sebagai user. Akses dashboard hanya untuk admin.
				</p>
			</div>

			{#if form?.message}
				<div class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}

			<form
				method="post"
				action="?/signUpEmail"
				class="space-y-5"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
			>
				<label for="name" class="block">
					<span class="mb-2 block text-sm font-medium text-gray-700">Nama Lengkap</span>
					<div class="relative">
						<UserRound size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							id="name"
							name="name"
							placeholder="Nama Anda"
							required
							class="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-900 focus:ring-2 focus:ring-green-900/20"
						/>
					</div>
				</label>

				<label for="email" class="block">
					<span class="mb-2 block text-sm font-medium text-gray-700">Email</span>
					<div class="relative">
						<Mail size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							id="email"
							type="email"
							name="email"
							placeholder="nama@email.com"
							required
							class="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-900 focus:ring-2 focus:ring-green-900/20"
						/>
					</div>
				</label>

				<label for="password" class="block">
					<span class="mb-2 block text-sm font-medium text-gray-700">Password</span>
					<div class="relative">
						<Lock size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							id="password"
							type="password"
							name="password"
							placeholder="Minimal 8 karakter"
							minlength="8"
							required
							class="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-900 focus:ring-2 focus:ring-green-900/20"
						/>
					</div>
				</label>

				<Button type="submit" class="w-full bg-green-900 hover:bg-green-800" disabled={isLoading}>
					<UserPlus size={18} />
					{isLoading ? 'Mendaftarkan...' : 'Daftar'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">
				Sudah punya akun?
				<a href={resolve('/login')} class="font-medium text-green-800 hover:text-green-700">
					Masuk di sini
				</a>
			</p>
		</div>

		<!-- <div class="hidden bg-green-950 p-10 text-white lg:block">
			<div class="flex h-full flex-col justify-between">
				<div>
					<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-white/10">
						<UserPlus size={26} />
					</div>
					<h2 class="text-3xl font-semibold tracking-tight">Reservasi lebih mudah</h2>
					<p class="mt-4 text-sm leading-6 text-green-50">
						Daftar akun untuk menggunakan layanan Jeep Station Puncak. Tim admin tetap
						memiliki dashboard khusus untuk mengelola operasional.
					</p>
				</div>
				<p class="text-sm text-green-100">Jeep Station Puncak</p>
			</div>
		</div> -->
	</section>
</main>
