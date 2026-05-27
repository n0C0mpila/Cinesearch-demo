<script>
  import { favoritosStore } from '$lib/stores/favorites.svelte.js'
  import { goto } from '$app/navigation'

  let busqueda = $state('')
  let tema = $state('dark')
  let searchAbierto = $state(false)

  function buscar(e) {
    if (e.key === 'Enter' && busqueda.trim()) {
      goto(`/?busqueda=${encodeURIComponent(busqueda.trim())}`)
      searchAbierto = false
    }
  }

  function toggleTema() {
    tema = tema === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', tema)
  }
</script>

<div class="bg-base-200 sticky top-0 z-50 shadow-md">
  <div class="flex items-center gap-2 px-4 h-16 max-w-screen-2xl mx-auto">

    <a href="/" class="btn btn-ghost text-xl font-black tracking-tight shrink-0">
      Cine<span class="text-error">Search</span>
    </a>

    <div class="flex-1 hidden md:flex md:w-auto w-0 overflow:hidden">
      <label class="input input-bordered flex items-center gap-2 w-full">
        <i class="ti ti-search text-base-content/40"></i>
        <input
          type="text"
          bind:value={busqueda}
          onkeydown={buscar}
          placeholder="Buscar película, serie..."
          class="grow"
        />
        {#if busqueda}
          <button onclick={() => busqueda = ''} class="text-base-content/40 hover:text-base-content" aria-label="Limpiar">
            <i class="ti ti-x"></i>
          </button>
        {/if}
      </label>
    </div>

    <div class="flex items-center gap-1 shrink-0 ml-auto">
      <button class="btn btn-ghost btn-circle md:hidden" onclick={() => searchAbierto = !searchAbierto} aria-label="Buscar">
        <i class="ti ti-search text-xl"></i>
      </button>

      <button class="btn btn-ghost btn-circle" onclick={toggleTema} aria-label="Cambiar tema">
        {#if tema === 'dark'}
          <i class="ti ti-sun text-xl"></i>
        {:else}
          <i class="ti ti-moon text-xl"></i>
        {/if}
      </button>

      <a href="/favoritos" class="btn btn-ghost btn-circle">
        <div class="indicator">
          <i class="ti ti-heart text-xl"></i>
          {#if favoritosStore.lista.length > 0}
            <span class="badge badge-error badge-xs indicator-item">
              {favoritosStore.lista.length}
            </span>
          {/if}
        </div>
      </a>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-9 rounded-full ring ring-error ring-offset-base-100 ring-offset-2">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=aaron" alt="usuario" />
          </div>
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-3 w-52 p-2 shadow-lg">
          <li class="menu-title px-4 py-2">
            <span class="font-bold text-base-content">Aaron Roman</span>
            <span class="text-xs text-base-content/50">aaronroman155@gmail.com</span>
          </li>
          <div class="divider my-1"></div>
          <li><a href="/favoritos"><i class="ti ti-heart mr-2"></i>Mis favoritos</a></li>
          <!-- svelte-ignore a11y_missing_attribute -->
          <li><a><i class="ti ti-settings mr-2"></i>Configuración</a></li>
          <div class="divider my-1"></div>
          <!-- svelte-ignore a11y_missing_attribute -->
          <li><a class="text-error"><i class="ti ti-logout mr-2"></i>Cerrar sesión</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

{#if searchAbierto}
  <div class="bg-base-200 px-4 py-2 md:hidden border-b border-base-300">
    <label class="input input-bordered flex items-center gap-2 w-full">
      <i class="ti ti-search text-base-content/40"></i>
      <!-- svelte-ignore a11y_autofocus -->
      <input
        type="text"
        bind:value={busqueda}
        onkeydown={buscar}
        placeholder="Buscar película..."
        class="grow"
        autofocus
      />
      {#if busqueda}
        <button onclick={() => { busqueda = ''; searchAbierto = false }} class="text-base-content/40" aria-label="Limpiar">
          <i class="ti ti-x"></i>
        </button>
      {/if}
    </label>
  </div>
{/if}