import { browser } from '$app/environment'

const inicial = browser ? JSON.parse(localStorage.getItem('favoritos') || '[]') : []

let _lista = $state(inicial)

function guardar() {
  if (browser) localStorage.setItem('favoritos', JSON.stringify(_lista))
}

export const favoritosStore = {
  get lista() { return _lista },

  agregar(pelicula) {
    _lista = [..._lista, {
      id: pelicula.id,
      title: pelicula.title,
      poster_path: pelicula.poster_path,
      release_date: pelicula.release_date,
      vote_average: pelicula.vote_average
    }]
    guardar()
  },

  quitar(id) {
    _lista = _lista.filter(f => f.id !== id)
    guardar()
  },

  esFavorito(id) {
    return _lista.some(f => f.id === id)
  }
}