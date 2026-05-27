<script>
 import { getPopulares, getBusqueda, getGeneros, getDescubrir, IMG_URL } from '$lib/api/movies.js'

import { page } from '$app/stores'

  let peliculas = $state([])
  let generos = $state([])
  let cargando = $state(true)
  let error = $state(null)
  let generoActivo = $state(null)
  let filtroEstrellas = $state(0)
  let filtroAno = $state('')

  const busqueda = $derived($page.url.searchParams.get('busqueda') || '')

  async function cargarGeneros() {
    const data = await getGeneros()
    generos = data.genres
  }

  async function cargarPeliculas() {
  cargando = true
  error = null
  try {
    let data

    if (busqueda) {
      data = await getBusqueda(busqueda)
    } else if (generoActivo || filtroAno) {
      const rango = getRango(filtroAno)
      data = await getDescubrir({
        generoId: generoActivo,
        anoDesde: rango?.desde,
        anoHasta: rango?.hasta
      })
    } else {
      data = await getPopulares()
    }

    peliculas = data.results
  } catch (e) {
    error = 'No se pudieron cargar las películas'
  } finally {
    cargando = false
  }
}
function getRango(valor) {
  if (!valor) return null
  const rangos = {
    2026: { desde: 2026, hasta: 2026 },
    2025: { desde: 2025, hasta: 2025 },
    2024: { desde: 2024, hasta: 2024 },
    2023: { desde: 2023, hasta: 2023 },
    2022: { desde: 2022, hasta: 2022 },
    2021: { desde: 2021, hasta: 2021 },
    2020: { desde: 2020, hasta: 2020 },
    2015: { desde: 2015, hasta: 2019 },
    2010: { desde: 2010, hasta: 2014 },
    2000: { desde: 2000, hasta: 2009 },
    1990: { desde: 1990, hasta: 1999 },
  }
  return rangos[parseInt(valor)] || null
}

  function cambiarGenero(id) {
    generoActivo = generoActivo === id ? null : id
    cargarPeliculas()
  }

  $effect(() => {
    busqueda
    cargarPeliculas()
  })

  cargarGeneros()

  let peliculasFiltradas = $derived(
  peliculas.filter(p => p.vote_average >= filtroEstrellas)
)
</script>

<div class="min-h-screen bg-base-100">
  <div class="max-w-7xl mx-auto px-4 py-6">

    <!-- Filtro géneros -->
    <div class="flex flex-wrap gap-2 mb-4">
      {#each generos as genero}
        <button
          class="btn btn-sm rounded-full {generoActivo === genero.id ? 'btn-error' : 'btn-ghost border border-base-300'}"
          onclick={() => cambiarGenero(genero.id)}
        >
          {genero.name}
        </button>
      {/each}
    </div>

    <!-- Filtros estrellas y año -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <span class="text-sm text-base-content/50">Rating:</span>
        <div class="flex gap-1">
          {#each [0, 5, 6, 7, 8] as nota}
            <button
              class="btn btn-xs rounded-full {filtroEstrellas === nota ? 'btn-error' : 'btn-ghost border border-base-300'}"
              onclick={() => filtroEstrellas = nota}
            >
              {nota === 0 ? 'Todos' : `⭐ ${nota}+`}
            </button>
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-2">
  <span class="text-sm text-base-content/50">Año:</span>
  <select
    class="select select-bordered select-xs"
    bind:value={filtroAno}
    onchange={() => cargarPeliculas()}
  >
    <option value="">Todos</option>
    <option value="2026">2026</option>
    <option value="2025">2025</option>
    <option value="2024">2024</option>
    <option value="2023">2023</option>
    <option value="2022">2022</option>
    <option value="2021">2021</option>
    <option value="2020">2020</option>
    <option value="2015">2015 - 2019</option>
    <option value="2010">2010 - 2014</option>
    <option value="2000">2000 - 2009</option>
    <option value="1990">1990 - 1999</option>
  </select>
</div>

  </div>

  <!-- Estado -->
    {#if cargando}
      <div class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg text-error"></span>
      </div>
    {:else if error}
      <div class="alert alert-error max-w-md mx-auto">
        <i class="ti ti-alert-circle"></i>
        <span>{error}</span>
      </div>
    {:else if peliculasFiltradas.length === 0}
      <div class="text-center py-20 text-base-content/40">
        <i class="ti ti-movie-off text-6xl"></i>
        <p class="mt-4 text-lg">No se encontraron resultados</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {#each peliculasFiltradas as pelicula}
          <a href="/pelicula/{pelicula.id}" class="group">
            <div class="card bg-base-200 shadow hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden">
              {#if pelicula.poster_path}
                <figure>
                  <img
                    src="{IMG_URL}{pelicula.poster_path}"
                    alt={pelicula.title}
                    class="w-full aspect-2/3 object-cover"
                  />
                </figure>
              {:else}
                <div class="w-full aspect-2/3 bg-base-300 flex items-center justify-center">
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
        {/each}
      </div>
    {/if}

  </div>
</div>