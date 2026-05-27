const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_KEY

export const IMG_URL = 'https://image.tmdb.org/t/p/w500'
export const IMG_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original'

async function fetchTMDB(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function getPopulares() {
  return fetchTMDB('/movie/popular')
}

export async function getBusqueda(query) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function getDetalle(id) {
  const [info, credits, videos, similares] = await Promise.all([
    fetchTMDB(`/movie/${id}`),
    fetchTMDB(`/movie/${id}/credits`),
    fetchTMDB(`/movie/${id}/videos`),
    fetchTMDB(`/movie/${id}/similar`)
  ])
  return { info, credits, videos, similares }
}

export async function getGeneros() {
  return fetchTMDB('/genre/movie/list')
}

export async function getPorGenero(generoId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${generoId}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function getActor(id) {
  const [info, peliculas] = await Promise.all([
    fetchTMDB(`/person/${id}`),
    fetchTMDB(`/person/${id}/movie_credits`)
  ])
  return { info, peliculas }
}
export async function getDescubrir({ generoId = null, anoDesde = null, anoHasta = null } = {}) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc`
  if (generoId) url += `&with_genres=${generoId}`
  if (anoDesde) url += `&primary_release_date.gte=${anoDesde}-01-01`
  if (anoHasta) url += `&primary_release_date.lte=${anoHasta}-12-31`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}