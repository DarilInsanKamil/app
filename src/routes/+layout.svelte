<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Toaster from '$lib/Toaster.svelte';

	let { children } = $props();
	let isAdminRoute = $derived(page.route.id?.startsWith('/(admin)') ?? false);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isAdminRoute}
	<Navigation />
{/if}
{@render children()}
{#if !isAdminRoute}
	<Footer />
	<Toaster />
{/if}
