<script lang="ts">
  import { resolve } from "$app/paths";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import blackLogo from '$lib/assets/favicon.svg';
  import Button from "$lib/components/ui/button/button.svelte";
  import SidebarMenu from "./SidebarMenu.svelte";
  import { LogOut } from "@lucide/svelte";
</script>

<Sidebar.Root>
 <Sidebar.Header>
     <div class="flex gap-2 items-center">
     <img src={blackLogo} alt="logo" width="40px" height="40px" />
     <h3 class="font-semibold">Jeep Station Puncak</h3>
     </div>
 </Sidebar.Header>
 <Sidebar.Content>
  <SidebarMenu/>
 </Sidebar.Content>
 <Sidebar.Footer>
     <form method="POST" action={resolve("/logout")} class="w-full">
         <Button type="submit" variant="destructive" class="w-full">
             <LogOut size={16} />
             Logout
         </Button>
     </form>
 </Sidebar.Footer>
</Sidebar.Root>
