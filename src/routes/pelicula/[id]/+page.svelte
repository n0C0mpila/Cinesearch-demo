<script>
  import './pelicula.css'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'

  const API_KEY = import.meta.env.VITE_TMDB_KEY
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  let pelicula = $state(null)
  let reparto = $state([])
  let director = $state(null)
  let trailer = $state(null)
  let similares = $state([])
  let cargando = $state(true)
  let error = $state(null)

  let favoritos = $state(browser ? JSON.parse(localStorage.getItem('favoritos') || '[]') : [])
  let esFavorito = $derived(favoritos.some(f => f.id === pelicula?.id))

  const id = $derived($page.params.id)

  async function cargarTodo() {
    cargando = true
    error = null
    try {
      const [infoRes, creditsRes, videosRes, similaresRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`),
        fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`),
        fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`),
        fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=es-ES`)
      ])

      const [info, credits, videos, sim] = await Promise.all([
        infoRes.json(),
        creditsRes.json(),
        videosRes.json(),
        similaresRes.json()
      ])

      pelicula = info
      reparto = credits.cast?.slice(0, 8) || []
      director = credits.crew?.find(p => p.job === 'Director') || null
      trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || null
      similares = sim.results?.slice(0, 6) || []

    } catch (e) {
      error = 'No se pudo cargar la película'
    } finally {
      cargando = false
    }
  }

  function toggleFavorito() {
    if (!browser) return
    if (esFavorito) {
      favoritos = favoritos.filter(f => f.id !== pelicula.id)
    } else {
      favoritos = [...favoritos, {
        id: pelicula.id,
        title: pelicula.title,
        poster_path: pelicula.poster_path,
        release_date: pelicula.release_date,
        vote_average: pelicula.vote_average
      }]
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }

  cargarTodo()
</script>

{#if cargando}
  <p class="estado">Cargando...</p>
{:else if error}
  <p class="estado">{error}</p>
{:else if pelicula}
  <div class="pagina">
    <div class="hero" style="background-image: url('https://image.tmdb.org/t/p/original{pelicula.backdrop_path}')">
      <div class="hero-overlay"></div>
    </div>

    <div class="contenido">
      <a href="/" class="volver">← Volver</a>

      <div class="main">
        <div class="poster">
          {#if pelicula.poster_path}
            <img src="{IMG_URL}{pelicula.poster_path}" alt={pelicula.title} />
          {:else}
            <div class="sin-imagen">Sin imagen</div>
          {/if}
        </div>

        <div class="info">
          <h1>{pelicula.title}</h1>

          {#if pelicula.tagline}
            <p class="tagline">"{pelicula.tagline}"</p>
          {/if}

          <div class="meta">
            <span class="badge">{pelicula.release_date?.slice(0,4) ?? 'S/F'}</span>
            <span class="badge">{pelicula.runtime} min</span>
            <span class="badge rating">⭐ {pelicula.vote_average?.toFixed(1)}</span>
            {#if director}
              <span class="badge">🎬 {director.name}</span>
            {/if}
          </div>

          <div class="generos">
            {#each pelicula.genres as genero}
              <span class="genero">{genero.name}</span>
            {/each}
          </div>

          {#if pelicula.overview}
            <p class="sinopsis">{pelicula.overview}</p>
          {/if}

          <div class="acciones">
            <button class="fav-btn {esFavorito ? 'activo' : ''}" onclick={toggleFavorito}>
              {esFavorito ? '❤️ Guardado' : '🤍 Favorito'}
            </button>

            {#if trailer}
              <a
                href="https://www.youtube.com/watch?v={trailer.key}"
                target="_blank"
                class="trailer-btn"
              >
                ▶ Ver trailer
              </a>
            {/if}
          </div>

        
        </div>
      </div>

      {#if reparto.length > 0}
        <div class="seccion">
          <h2>Reparto</h2>
          <div class="reparto">
            {#each reparto as actor}
              <div class="actor">
                {#if actor.profile_path}
                  <img src="{IMG_URL}{actor.profile_path}" alt={actor.name} />
                {:else}
                  <div class="sin-foto">👤</div>
                {/if}
                <p class="actor-nombre">{actor.name}</p>
                <p class="actor-personaje">{actor.character}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if similares.length > 0}
        <div class="seccion">
          <h2>Películas similares</h2>
          <div class="similares">
            {#each similares as sim}
              <a href="/pelicula/{sim.id}" class="card-sim">
                {#if sim.poster_path}
                  <img src="{IMG_URL}{sim.poster_path}" alt={sim.title} />
                {:else}
                  <div class="sin-imagen-sim">Sin imagen</div>
                {/if}
                <p class="sim-titulo">{sim.title}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}


