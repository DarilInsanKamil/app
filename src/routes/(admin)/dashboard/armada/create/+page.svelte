<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/toast.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	let previewUrl = $state<string | null>(null);
	const handleImageChange = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			previewUrl = URL.createObjectURL(file);
		} else {
			previewUrl = null;
		}
	};
</script>

<div class="py-5 lg:px-10 px-5">
    <a href={resolve("/dashboard/armada")}>
        Kembali
    </a>
</div>

<section class="lg:p-10 p-5">
	<form
		action="?/upload"
		method="POST"
		class="grid lg:gap-5 lg:w-1/2 gap-3 w-full"
		enctype="multipart/form-data"
		use:enhance={() => {
			return async ({ update, result }) => {
				if (result.type === 'success') {
					addToast('Berhasil insert data product', 'success');
					goto(resolve('/dashboard/armada'));
				} else if (result.type === 'failure') {
					addToast((result.data as { message?: string })?.message || 'Terjadi kesalahan', 'fail');
				}
				await update();
			};
		}}
	>
		<div>
			<label for="image" class="font-semibold"> Gambar Armada * </label>
			<br />
			<input
				type="file"
				name="image"
				accept="image/*"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				onchange={handleImageChange}
				required
			/>
			{#if previewUrl}
				<p class="text-sm text-gray-500 mb-2">Preview:</p>
				<img
					src={previewUrl}
					alt="Preview armada"
					class="w-full max-w-xs h-48 object-cover rounded-md border border-gray-300"
				/>
			{/if}
		</div>
		<div>
			<label for="namaArmada" class="font-semibold"> Nama Armada * </label>
			<br />
			<input
				type="text"
				name="namaArmada"
				placeholder="Masukan nama armada"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				required
			/>
		</div>
		<div>
			<label for="hargaSewa" class="font-semibold"> Harga Sewa * </label>
			<br />
			<input
				type="text"
				name="hargaSewa"
				placeholder="Masukan harga sewa/hari"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				required
			/>
		</div>
		<div>
			<label for="kapasitas" class="font-semibold"> Kapasitas * </label>
			<br />
			<input
				type="number"
				name="kapasitas"
				placeholder="Masukan jumlah kapasitas"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				required
			/>
		</div>
		<div>
			<label for="platNomor" class="font-semibold"> Plat Nomor * </label>
			<br />
			<input
				type="text"
				name="platNomor"
				placeholder="Masukan nopol armada"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				required
			/>
		</div>
		<div>
			<label for="deskripsi" class="font-semibold"> Deskripsi * </label>
			<br />
			<textarea
				name="deskripsi"
				cols="4"
				placeholder="Masuk deskrirpsi armada"
				class="border mt-2 w-full border-green-400 focus:outline-green-600 p-2 rounded-md"
				required
			></textarea>
		</div>
		<Button type="submit" class="bg-green-900 hover:bg-green-800">Upload Data Armada</Button>
	</form>
</section>
