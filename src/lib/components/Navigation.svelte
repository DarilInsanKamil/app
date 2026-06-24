<script>
	import { resolve } from "$app/paths";
  import logo from "$lib/assets/favicon.svg";
  import { cn } from "$lib/utils";
  import { Menu, X } from "@lucide/svelte";

  let scrollY = $state(0);
  let mobileOpen = $state(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Paket Bundling', href: '/bundle' },
    { label: 'List Armada', href: '/armada' },
    { label: 'Testimoni', href: '/testimoni' },
    { label: 'Gallery', href: '/gallery' },
  ];
</script>

<svelte:window bind:scrollY />

<nav
  class={cn("fixed z-50 w-[95%] md:w-[90%] mx-auto top-0 left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-md text-black transition-all duration-300 shadow-sm")}
>
  <div class="flex w-full items-center justify-between px-4 md:px-10 lg:px-20 transition-all duration-300 py-2">
    <!-- Logo -->
    <div class="flex gap-2 items-center">
      <img src={logo} alt="logo" height="30px" width="30px"
        class={cn("transition-all duration-300")}
      />
      <h3 class="font-semibold tracking-tight text-sm md:text-base">Jeep Station Puncak</h3>
    </div>

    <!-- Desktop nav links -->
    <ul class="hidden md:flex gap-6 lg:gap-12 float-right text-sm">
      {#each navLinks as link}
        <li>
          <a href={resolve(link.href)} class="hover:text-green-700 transition-colors">{link.label}</a>
        </li>
      {/each}
      <li class='bg-green-300 py-1 px-2 rounded-md'>
        <a href={resolve("/checkbooking")} class="hover:text-green-700 transition-colors text-sm">Check Kode Booking</a>
      </li>
    </ul>

    <!-- Mobile hamburger -->
    <button
      class="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
      onclick={() => mobileOpen = !mobileOpen}
      aria-label="Toggle menu"
    >
      {#if mobileOpen}
        <X size={22} />
      {:else}
        <Menu size={22} />
      {/if}
    </button>
  </div>

  <!-- Mobile dropdown -->
  {#if mobileOpen}
    <div class="md:hidden border-t border-gray-100 px-4 pb-4 pt-2">
      <ul class="flex flex-col gap-1">
        {#each navLinks as link}
          <li>
            <a
              href={resolve(link.href)}
              class="block py-2 px-2 rounded-md hover:bg-green-50 hover:text-green-700 transition-colors text-sm"
              onclick={() => mobileOpen = false}
            >
              {link.label}
            </a>
          </li>
        {/each}
        <li>
          <a
            href={resolve("/checkbooking")}
            class="block py-2 px-2 rounded-md bg-green-100 text-green-900 hover:bg-green-200 transition-colors text-sm font-medium mt-1"
            onclick={() => mobileOpen = false}
          >
            Check Kode Booking
          </a>
        </li>
      </ul>
    </div>
  {/if}
</nav>
