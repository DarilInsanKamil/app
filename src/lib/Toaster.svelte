<script>
	import { removeToast, toastStore } from '$lib/toast.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="toaster-container">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="toast {toast.type}"
			animate:flip={{ duration: 300 }}
			in:fly={{ y: 20, duration: 300 }}
			out:fade={{ duration: 200 }}
			role="alert"
		>
			<span>{toast.message}</span>
			<button onclick={() => removeToast(toast.id)} aria-label="Close toast"> &times; </button>
		</div>
	{/each}
</div>

<style>
	.toaster-container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 9999;
	}

	.toast {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		min-width: 250px;
		border-radius: 6px;
		color: white;
		font-family: sans-serif;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.toast.success {
		background-color: #10b981;
	}

	.toast.fail {
		background-color: #ef4444;
	}

	button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0 0 0 12px;
	}
</style>
