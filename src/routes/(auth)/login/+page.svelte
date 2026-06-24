<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Lock, LogIn, Mail, ShieldCheck } from '@lucide/svelte';
	import type { ActionData } from './$types';

	let { form }: { form?: ActionData } = $props();
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login - Jeep Station Puncak</title>
</svelte:head>

<main class="mt-16 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
	<section class="grid w-full max-w-5xl overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">

		<div class="p-6 md:p-10">
			<div class="mb-8">
				<p class="text-sm font-medium uppercase tracking-wide text-green-800">Login</p>
				<h2 class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Selamat datang</h2>
				<p class="mt-2 text-sm text-gray-500">Masukkan email dan password akun Anda.</p>
			</div>

			{#if form?.message}
				<div class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}

			<form
				method="post"
				action="?/signInEmail"
				class="space-y-5"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
			>
				<label for="email" class="block">
					<span class="mb-2 block text-sm font-medium text-gray-700">Email</span>
					<div class="relative">
						<Mail size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							id="email"
							type="email"
							name="email"
							placeholder="admin@jeepstationpuncak.com"
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
							placeholder="Masukkan password"
							required
							class="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-900 focus:ring-2 focus:ring-green-900/20"
						/>
					</div>
				</label>

				<Button type="submit" class="w-full bg-green-900 hover:bg-green-800" disabled={isLoading}>
					<LogIn size={18} />
					{isLoading ? 'Memproses...' : 'Masuk'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">
				Belum punya akun?
				<a href={resolve('/register')} class="font-medium text-green-800 hover:text-green-700">
					Daftar sekarang
				</a>
			</p>
		</div>
	</section>
</main>
