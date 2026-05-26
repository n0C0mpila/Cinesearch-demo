<script>
  import { browser } from '$app/environment'
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  let favoritos = $state([])

  if (browser) {
    favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]')
  }

  function eliminarFavorito(id) {
    favoritos = favoritos.filter(f => f.id !== id)
    if (browser) {
      localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }
  }
</script>

<div class="pagina">
  <a href="/" class="volver">← Volver</a>

  <h1>Mis favoritos</h1>

  {#if favoritos.length === 0}
    <p class="vacio">No tenés películas guardadas todavía.</p>
  {:else}
    <div class="grilla">
      {#each favoritos as pelicula}
        <div class="card">
          <a href="/pelicula/{pelicula.id}">
            {#if pelicula.poster_path}
              <img src="{IMG_URL}{pelicula.poster_path}" alt={pelicula.title} />
            {:else}
              <div class="sin-imagen">Sin imagen</div>
            {/if}
            <div class="info">
              <p class="titulo">{pelicula.title}</p>
              <p class="año">{pelicula.release_date?.slice(0,4) ?? 'S/F'}</p>
            </div>
          </a>
          <button class="eliminar" onclick={() => eliminarFavorito(pelicula.id)}>
            Eliminar
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>


  .pagina {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
  }

  .volver {
    display: inline-block;
    color: #999;
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 32px;
    transition: color 0.15s;
  }

  .volver:hover {
    color: #e50914;
  }

  h1 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 28px;
    letter-spacing: -0.02em;
  }

  .vacio {
    color: #666;
    font-size: 15px;
    margin-top: 40px;
    text-align: center;
  }

  .grilla {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }

  .card {
    border-radius: 10px;
    overflow: hidden;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
  }

  .card a {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: opacity 0.15s;
  }

  .card a:hover {
    opacity: 0.85;
  }

  .card img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
  }

  .sin-imagen {
    width: 100%;
    aspect-ratio: 2/3;
    background: #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    font-size: 13px;
  }

  .info {
    padding: 10px 12px;
  }

  .titulo {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .año {
    font-size: 12px;
    color: #666;
  }

  .eliminar {
    background: transparent;
    border: none;
    border-top: 1px solid #2a2a2a;
    color: #666;
    font-size: 12px;
    padding: 8px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    width: 100%;
  }

  .eliminar:hover {
    background: #e50914;
    color: white;
  }
</style>