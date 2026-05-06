<script>
	import { resolve } from "$app/paths";
  import logo from "$lib/assets/favicon.svg";
  import { cn } from "$lib/utils";

  let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />
<nav
class={cn("fixed z-50 w-[90%] mx-auto top-0 left-0 right-0 mt-2 bg-white/80 rounded-md text-black transition-all duration-300")}
>
<div
  class="flex w-full items-center justify-between px-20 transition-all duration-300  py-2">
  <div class="flex gap-2 items-center">
    <img src={logo} alt="logo" height="30px" width="30px"
    class={cn("transition-all duration-300")}
    />
    <h3 class="font-semibold tracking-tight">Jeep Station Puncak</h3>
  </div>
  <ul class="flex gap-15 float-right">
    <li>
      <a href={resolve("/")} class="hover:text-green-700 transition-colors">Home</a>
    </li>
    <li>
      <a href={resolve("/bundle")} class="hover:text-green-700 transition-colors">Paket Bundling</a>
    </li>
    <li>
      <a href={resolve("/armada")} class="hover:text-green-700 transition-colors">List Armada</a>
    </li>
    <li>
      <a href={resolve("/testimoni")} class="hover:text-green-700 transition-colors">Testimoni</a>
    </li>
    <li>
      <a href={resolve("/gallery")} class="hover:text-green-700 transition-colors">Gallery</a>
    </li>
  </ul>
</div>
</nav>
