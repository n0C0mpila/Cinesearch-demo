<script>
  import { favoritosStore } from '$lib/stores/favorites.svelte.js'
  import { IMG_URL } from '$lib/api/movies.js'
</script>

<div class="max-w-7xl mx-auto px-4 py-8">

  <div class="flex items-center justify-between mb-8">
    <h1 class="text-2xl font-bold">Mis favoritos</h1>
    {#if favoritosStore.lista.length > 0}
      <span class="badge badge-error badge-outline">
        {favoritosStore.lista.length} {favoritosStore.lista.length === 1 ? 'película' : 'películas'}
      </span>
    {/if}
  </div>

  {#if favoritosStore.lista.length === 0}
    <div class="flex flex-col items-center justify-center py-32 text-base-content/30">
      <i class="ti ti-heart text-7xl mb-4"></i>
      <p class="text-xl font-medium">No tenés favoritos todavía</p>
      <p class="text-sm mt-2">Explorá películas y guardá las que te gusten</p>
      <a href="/" class="btn btn-error btn-outline mt-6 gap-2">
        <i class="ti ti-search"></i>
        Explorar películas
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {#each favoritosStore.lista as pelicula}
        <div class="group relative">
          <a href="/pelicula/{pelicula.id}">
            <div class="card bg-base-200 overflow-hidden hover:-translate-y-1 transition-all duration-200 hover:shadow-xl">
              {#if pelicula.poster_path}
                <figure>
                  <img
                    src="{IMG_URL}{pelicula.poster_path}"
                    alt={pelicula.title}
                    class="w-full aspect-[2/3] object-cover"
                  />
                </figure>
              {:else}
                <div class="w-full aspect-[2/3] bg-base-300 flex items-center justify-center">
                  <i class="ti ti-photo-off text-3xl text-base-content/30"></i>
                </div>
              {/if}
              <div class="card-body p-3">
                <p class="text-sm font-semibold line-clamp-2 leading-tight">{pelicula.title}</p>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-base-content/50">{pelicula.release_date?.slice(0,4) ?? 'S/F'}</span>
                  <span class="text-xs text-warning">⭐ {pelicula.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </a>
          <button
            class="btn btn-circle btn-xs btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onclick={() => favoritosStore.quitar(pelicula.id)}
            aria-label="Eliminar favorito"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
      {/each}
    </div>
  {/if}

</div>