<script>
  import { page } from '$app/stores'
  import { getActor, IMG_URL } from '$lib/api/movies.js'

  const id = $derived($page.params.id)

  let actor = $state(null)
  let peliculas = $state([])
  let cargando = $state(true)
  let error = $state(null)

  async function cargarActor() {
    cargando = true
    error = null
    try {
      const { info, peliculas: creds } = await getActor(id)
      actor = info
      peliculas = creds.cast
        ?.filter(p => p.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20) || []
    } catch (e) {
      error = 'No se pudo cargar el actor'
    } finally {
      cargando = false
    }
  }

  cargarActor()
</script>

{#if cargando}
  <div class="flex justify-center items-center min-h-screen">
    <span class="loading loading-spinner loading-lg text-error"></span>
  </div>
{:else if error}
  <div class="flex justify-center items-center min-h-screen">
    <div class="alert alert-error max-w-md">
      <i class="ti ti-alert-circle"></i>
      <span>{error}</span>
    </div>
  </div>
{:else if actor}
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!-- PERFIL ACTOR -->
    <div class="flex flex-col md:flex-row gap-8 mb-12">

      <!-- FOTO -->
      <div class="shrink-0 mx-auto md:mx-0">
        {#if actor.profile_path}
          <img
            src="{IMG_URL}{actor.profile_path}"
            alt={actor.name}
            class="w-48 md:w-56 rounded-xl shadow-2xl ring-2 ring-base-300"
          />
        {:else}
          <div class="w-48 md:w-56 aspect-2/3 bg-base-200 rounded-xl flex items-center justify-center">
            <i class="ti ti-user text-6xl text-base-content/30"></i>
          </div>
        {/if}
      </div>

      <!-- INFO -->
      <div class="flex-1 flex flex-col gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">{actor.name}</h1>
          {#if actor.known_for_department}
            <p class="text-base-content/50 mt-1">{actor.known_for_department}</p>
          {/if}
        </div>

        <div class="flex flex-wrap gap-2">
          {#if actor.birthday}
            <div class="badge badge-outline gap-1">
              <i class="ti ti-calendar"></i>
              {new Date(actor.birthday).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          {/if}
          {#if actor.place_of_birth}
            <div class="badge badge-outline gap-1">
              <i class="ti ti-map-pin"></i>
              {actor.place_of_birth}
            </div>
          {/if}
          {#if actor.deathday}
            <div class="badge badge-error badge-outline gap-1">
              <i class="ti ti-cross"></i>
              {new Date(actor.deathday).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          {/if}
        </div>

        {#if actor.biography}
          <p class="text-base-content/70 leading-relaxed max-w-2xl line-clamp-6">
            {actor.biography}
          </p>
        {:else}
          <p class="text-base-content/40 italic">Sin biografía disponible.</p>
        {/if}
      </div>
    </div>

    <!-- PELÍCULAS -->
    {#if peliculas.length > 0}
      <div>
        <h2 class="text-xl font-bold mb-4">Filmografía destacada</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {#each peliculas as pelicula}
            <a href="/pelicula/{pelicula.id}" class="group">
              <div class="card bg-base-200 overflow-hidden hover:-translate-y-1 transition-all duration-200 hover:shadow-xl">
                <figure>
                  <img
                    src="{IMG_URL}{pelicula.poster_path}"
                    alt={pelicula.title}
                    class="w-full aspect-2/3 object-cover"
                  />
                </figure>
                <div class="card-body p-2">
                  <p class="text-xs font-semibold line-clamp-2">{pelicula.title}</p>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-xs text-base-content/40">{pelicula.release_date?.slice(0,4) ?? 'S/F'}</span>
                    <span class="text-xs text-warning">⭐ {pelicula.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

  </div>
{/if}