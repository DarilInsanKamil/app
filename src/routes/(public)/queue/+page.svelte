<script lang="ts">
	import { onMount } from 'svelte';

	let status = $state('Connecting...');
	let serverData = $state({ title: 'Menunggu data...', time: '' });
	let productList = $state<any>([]);

	onMount(() => {
		// Hubungkan ke endpoint yang tadi dibuat
		const eventSource = new EventSource('/api/sse');

		eventSource.onmessage = (event) => {
			status = 'live queue';
			productList = JSON.parse(event.data);
		};

		eventSource.onerror = () => {
			status = 'Disconnected. Reconnecting...';
		};

		// Bersihkan koneksi saat page dihancurkan
		return () => {
			eventSource.close();
		};
	});
</script>

<div class="overlay-container">
	<div class="badge">{status}</div>
	{#each productList as queue (queue.id)}
		<p>{queue.status}</p>
		<p>{queue.order.user.name}</p>
		<div class="flex items-center justify-between">
			{#each queue.order.orderItems as order}
				<p>{order.product.nama}</p>
				<p>{order.quantity}</p>
			{/each}
		</div>
	{/each}
</div>

<style lang='postcss'>

    .queue-page {
        background-color: transparent;
        color: white;
        font-family: sans-serif;
    }

	.overlay-container {
		padding: 20px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10px;
		display: inline-block;
		width: 200px;
	}
	.badge {
		font-size: 0.7rem;
		text-transform: uppercase;
		color: #00ff00;
	}
</style>
