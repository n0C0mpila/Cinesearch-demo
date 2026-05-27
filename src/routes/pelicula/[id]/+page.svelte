<script>
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { getDetalle, IMG_URL, IMG_URL_ORIGINAL } from "$lib/api/movies.js";
  import { favoritosStore } from '$lib/stores/favorites.svelte.js'

  const id = $derived($page.params.id);

  let pelicula = $state(null);
  let reparto = $state([]);
  let director = $state(null);
  let trailer = $state(null);
  let similares = $state([]);
  let cargando = $state(true);
  let error = $state(null);

  let esFavorito = $derived(
    pelicula ? favoritosStore.esFavorito(pelicula.id) : false,
  );

  async function cargarTodo() {
    cargando = true;
    error = null;
    try {
      const { info, credits, videos, similares: sim } = await getDetalle(id);
      pelicula = info;
      reparto = credits.cast?.slice(0, 10) || [];
      director = credits.crew?.find((p) => p.job === "Director") || null;
      trailer =
        videos.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        ) || null;
      similares = sim.results?.slice(0, 6) || [];
    } catch (e) {
      error = "No se pudo cargar la película";
    } finally {
      cargando = false;
    }
  }
  $effect(() => {
    id;
    cargarTodo();
  });

  function toggleFavorito() {
    if (!pelicula) return;
    if (esFavorito) {
      favoritosStore.quitar(pelicula.id);
    } else {
      favoritosStore.agregar(pelicula);
    }
  }

  cargarTodo();
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
{:else if pelicula}
  <!-- HERO BACKDROP -->
  <div class="relative w-full h-48 md:h-64 overflow-hidden">
  {#if pelicula.backdrop_path}
    <img
      src="{IMG_URL_ORIGINAL}{pelicula.backdrop_path}"
      alt={pelicula.title}
      class="w-full h-full object-cover object-top"
    />
  {/if}
  <div class="absolute inset-0 bg-linear-to-b from-transparent via-base-100/60 to-base-100"></div>
</div>

<div class="max-w-6xl mx-auto px-4 -mt-20 relative pb-8">

  <div class="max-w-6xl mx-auto px-4 -mt-16 relative pb-8">
    <!-- MAIN INFO -->
    <div class="flex flex-col md:flex-row gap-8 mb-10">
      <!-- POSTER -->
      <div class="shrink-0 mx-auto md:mx-0">
        {#if pelicula.poster_path}
          <img
            src="{IMG_URL}{pelicula.poster_path}"
            alt={pelicula.title}
            class="w-44 md:w-56 rounded-xl shadow-2xl ring-2 ring-base-300"
          />
        {:else}
          <div
            class="w-44 md:w-56 aspect-2/3 bg-base-200 rounded-xl flex items-center justify-center"
          >
            <i class="ti ti-photo-off text-4xl text-base-content/30"></i>
          </div>
        {/if}
      </div>

      <!-- INFO -->
      <div class="flex-1 flex flex-col gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">
            {pelicula.title}
          </h1>
          {#if pelicula.tagline}
            <p class="text-base-content/50 italic mt-1">"{pelicula.tagline}"</p>
          {/if}
        </div>

        <!-- META BADGES -->
        <div class="flex flex-wrap gap-2">
          <div class="badge badge-outline">
            {pelicula.release_date?.slice(0, 4) ?? "S/F"}
          </div>
          <div class="badge badge-outline">{pelicula.runtime} min</div>
          <div class="badge badge-warning gap-1">
            ⭐ {pelicula.vote_average?.toFixed(1)}
          </div>
          {#if director}
            <div class="badge badge-outline gap-1">
              <i class="ti ti-movie"></i>
              {director.name}
            </div>
          {/if}
        </div>

        <!-- GÉNEROS -->
        <div class="flex flex-wrap gap-2">
          {#each pelicula.genres as genero}
            <span class="badge badge-error badge-outline">{genero.name}</span>
          {/each}
        </div>

        <!-- SINOPSIS -->
        {#if pelicula.overview}
          <p class="text-base-content/70 leading-relaxed max-w-2xl">
            {pelicula.overview}
          </p>
        {/if}

        <!-- ACCIONES -->
        <div class="flex flex-wrap gap-3 mt-2">
          {#if trailer}
            <a
              href="https://www.youtube.com/watch?v={trailer.key}"
              target="_blank"
              class="btn btn-error gap-2"
            >
              <i class="ti ti-player-play-filled"></i>
              Ver trailer
            </a>
          {/if}
          <button
            class="btn gap-2 {esFavorito ? 'btn-error' : 'btn-outline'}"
            onclick={toggleFavorito}
          >
            <i class="ti ti-heart{esFavorito ? '-filled' : ''}"></i>
            {esFavorito ? "Guardado" : "Agregar a favoritos"}
          </button>
        </div>
      </div>
    </div>

    <!-- REPARTO -->
    {#if reparto.length > 0}
      <div class="mb-10">
        <h2 class="text-xl font-bold mb-4">Reparto</h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          {#each reparto as actor}
            <a href="/actor/{actor.id}" class="shrink-0 w-24 text-center group">
              <div
                class="w-24 h-24 rounded-full overflow-hidden bg-base-200 mb-2 ring-2 ring-transparent group-hover:ring-error transition-all"
              >
                {#if actor.profile_path}
                  <img
                    src="{IMG_URL}{actor.profile_path}"
                    alt={actor.name}
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-user text-3xl text-base-content/30"></i>
                  </div>
                {/if}
              </div>
              <p
                class="text-xs font-semibold line-clamp-2 group-hover:text-error transition-colors"
              >
                {actor.name}
              </p>
              <p class="text-xs text-base-content/40 line-clamp-1">
                {actor.character}
              </p>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    <!-- PELÍCULAS SIMILARES -->
    {#if similares.length > 0}
      <div>
        <h2 class="text-xl font-bold mb-4">Películas similares</h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {#each similares as sim}
            <a href="/pelicula/{sim.id}" class="group">
              <div
                class="card bg-base-200 overflow-hidden hover:-translate-y-1 transition-all duration-200 hover:shadow-xl"
              >
                {#if sim.poster_path}
                  <figure>
                    <img
                      src="{IMG_URL}{sim.poster_path}"
                      alt={sim.title}
                      class="w-full aspect-2/3 object-cover"
                    />
                  </figure>
                {:else}
                  <div
                    class="w-full aspect-2/3 bg-base-300 flex items-center justify-center"
                  >
                    <i class="ti ti-photo-off text-2xl text-base-content/30"
                    ></i>
                  </div>
                {/if}
                <div class="card-body p-2">
                  <p class="text-xs font-semibold line-clamp-2">{sim.title}</p>
                  <p class="text-xs text-base-content/40">
                    {sim.release_date?.slice(0, 4) ?? "S/F"}
                  </p>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
{/if}
