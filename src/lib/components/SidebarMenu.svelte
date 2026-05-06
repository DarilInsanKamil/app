<script>
	import { resolve } from "$app/paths";
    import { page } from "$app/state";
</script>

<div class="flex flex-col justify-between p-5 border-r h-screen">
    <ul class="">
            <a href={resolve("/dashboard")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                   page.url.pathname === '/dashboard'
                     ? 'bg-green-100 text-green-700 font-semibold'
                     : ''
                 }`}
            >
        <li>
            Home
        </li>
            </a>
            <a href={resolve("/dashboard/armada")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                  page.url.pathname.startsWith('/dashboard/armada') ? 'bg-green-100 text-green-700 font-semibold' : ''
                }`}
            >
            Armada
            </a>
            <a href={resolve("/dashboard/bundle")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                  page.url.pathname.startsWith('/dashboard/bundle') ? 'bg-green-100 text-green-700 font-semibold' : ''
                }`}
                >
                Paket Bundle
            </a>
        <a href={resolve("/dashboard/customer")}
            class={`block p-2 rounded-sm hover:bg-green-50 ${
              page.url.pathname.startsWith('/dashboard/customer') ? 'bg-green-100 text-green-700 font-semibold' : ''
            }`}
            >
                Customer
        </a>
            <a href={resolve("/dashboard/reservasi")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                  page.url.pathname.startsWith('/dashboard/reservasi') ? 'bg-green-100 text-green-700 font-semibold' : ''
                }`}
                >
                Reservasi
            </a>
            <a href={resolve("/dashboard/testimoni")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                  page.url.pathname.startsWith('/dashboard/testimoni') ? 'bg-green-100 text-green-700 font-semibold' : ''
                }`}
                >
                Testimoni
            </a>
            <a href={resolve("/dashboard/gallery")}
                class={`block p-2 rounded-sm hover:bg-green-50 ${
                  page.url.pathname.startsWith('/dashboard/gallery') ? 'bg-green-100 text-green-700 font-semibold' : ''
                }`}
                >
                Gallery
            </a>
    </ul>
</div>
