<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Toaster from '$lib/Toaster.svelte';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>


<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full">
    <Sidebar.Trigger />
    {@render children?.()}
    <Toaster />
  </main>
</Sidebar.Provider>
