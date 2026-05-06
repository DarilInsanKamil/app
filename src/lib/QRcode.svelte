<script>
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	let { text } = $props(); // Menggunakan Runes untuk props
	let qrCanvas = $state();

	$effect(() => {
		if (qrCanvas && text) {
			QRCode.toCanvas(qrCanvas, text, { width: 200 }, (error) => {
				if (error) console.error(error);
			});
		}
	});
</script>

<canvas bind:this={qrCanvas}></canvas>
