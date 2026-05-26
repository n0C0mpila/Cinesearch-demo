<script>
  import './home.css'
  const API_KEY = import.meta.env.VITE_TMDB_KEY
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  let peliculas = $state([])
  let generos = $state([])
  let cargando = $state(true)
  let error = $state(null)
  let busqueda = $state('')
  let generoActivo = $state(null)

  async function cargarGeneros() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
    const data = await res.json()
    generos = data.genres
  }

  async function cargarPopulares() {
    cargando = true
    error = null
    try {
      const url = generoActivo
        ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${generoActivo}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`
      const res = await fetch(url)
      const data = await res.json()
      peliculas = data.results
    } catch (e) {
      error = 'No se pudieron cargar las películas'
    } finally {
      cargando = false
    }
  }

  async function buscarPeliculas() {
    if (busqueda.trim() === '') {
      cargarPopulares()
      return
    }
    cargando = true
    error = null
    try {
      const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${busqueda}`)
      const data = await res.json()
      peliculas = data.results
    } catch (e) {
      error = 'Error al buscar'
    } finally {
      cargando = false
    }
  }

  function cambiarGenero(id) {
    generoActivo = generoActivo === id ? null : id
    busqueda = ''
    cargarPopulares()
  }

  cargarGeneros()
  cargarPopulares()
  let filtroEstrellas = $state(0)

function cambiarEstrellas(nota) {
  filtroEstrellas = nota
}
</script>
<main>
  <div class="nav">
    <h1>Cine<span>Search</span></h1>
    <a href="/favoritos" class="link-favoritos">❤️ Mis favoritos</a>
  </div>

  <div class="busqueda">
    <input
      type="text"
      bind:value={busqueda}
      placeholder="Buscar película..."
      onkeydown={(e) => e.key === "Enter" && buscarPeliculas()}
    />
    <button onclick={buscarPeliculas}>Buscar</button>
    {#if busqueda}
      <button class="clear" onclick={() => { busqueda = ""; cargarPopulares() }}>✕</button>
    {/if}
  </div>

  <div class="generos">
    {#each generos as genero}
      <button
        class="genero-btn {generoActivo === genero.id ? 'activo' : ''}"
        onclick={() => cambiarGenero(genero.id)}
      >
        {genero.name}
      </button>
    {/each}
  </div>

  <div class="estrellas">
    <span class="estrellas-label">Mínimo:</span>
    {#each [0, 5, 6, 7, 8] as nota}
      <button
        class="estrella-btn {filtroEstrellas === nota ? 'activo' : ''}"
        onclick={() => cambiarEstrellas(nota)}
      >
        {nota === 0 ? 'Todas' : `⭐ ${nota}+`}
      </button>
    {/each}
  </div>

  {#if cargando}
    <p class="estado">Cargando...</p>
  {:else if error}
    <p class="estado">{error}</p>
  {:else if peliculas.length === 0}
    <p class="estado">No se encontraron resultados para "{busqueda}"</p>
  {:else}
    <div class="grilla">
      {#each peliculas.filter(p => p.vote_average >= filtroEstrellas) as pelicula}
        <a href="/pelicula/{pelicula.id}" class="card">
          {#if pelicula.poster_path}
            <img src="{IMG_URL}{pelicula.poster_path}" alt={pelicula.title} />
          {:else}
            <div class="sin-imagen">Sin imagen</div>
          {/if}
          <div class="info">
            <p class="titulo">{pelicula.title}</p>
            <p class="año">{pelicula.release_date?.slice(0, 4) ?? "S/F"}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</main>


