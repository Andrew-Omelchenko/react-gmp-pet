import { api } from './client';
import type { ApiMoviesResponse } from './types';
import { mapApiMovieToUi } from './mappers';
import type { SortValue } from '../../shared/ui/sort-control';

export type FetchMoviesParams = {
  query: string;
  sort: SortValue;
  genre: string;
  offset?: number;
  limit?: number;
  signal?: AbortSignal;
};

export async function fetchMovies({
  query,
  sort,
  genre,
  offset,
  limit,
  signal,
}: FetchMoviesParams) {
  const sortBy = sort === 'releaseDate' ? 'release_date' : 'title';
  const sortOrder = sort === 'releaseDate' ? 'desc' : 'asc';

  // Backend accepts:
  // - search + searchBy ('title' or 'genres')
  // - filter (array/CSV of genres) — we’ll send a single genre when not 'All'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {
    sortBy,
    sortOrder,
    offset,
    limit,
  };

  if (query.trim()) {
    params.search = query.trim();
    params.searchBy = 'title';
  }

  if (genre && genre !== 'All') {
    params.filter = genre;
  }

  const res = await api.get<ApiMoviesResponse>('/movies', { params, signal });
  return {
    ...res.data,
    data: res.data.data.map(mapApiMovieToUi),
  };
}

export type ApiMovie = {
  id: number | string;
  title: string;
  release_date?: string;
  poster_path: string;
  overview?: string;
  vote_average?: number;
  runtime?: number;
  genres: string[];
};

export async function fetchMovieById(id: string | number, signal?: AbortSignal): Promise<ApiMovie> {
  const resp = await api.get(`/movies/${id}`, { signal });
  return resp.data as ApiMovie;
}

export type MovieBasePayload = {
  title: string;
  poster_path: string;
  overview: string;
  runtime: number;
  release_date?: string;
  tagline?: string;
  vote_average?: number;
  vote_count?: number;
  budget?: number;
  revenue?: number;
  genres: string[];
};

export async function createMovie(payload: MovieBasePayload, signal?: AbortSignal) {
  const resp = await api.post('/movies', payload, { signal });
  // backend returns Movie with id
  return resp.data as { id: number | string } & MovieBasePayload;
}

export type UpdateMoviePayload = {
  id?: string | number;
  title: string;
  poster_path: string;
  overview: string;
  runtime: number;
  genres: string[];
  release_date?: string;
  tagline?: string;
  vote_average?: number;
  vote_count?: number;
  budget?: number;
  revenue?: number;
};

export async function updateMovie(payload: UpdateMoviePayload, signal?: AbortSignal) {
  const { data } = await api.put('/movies', payload, { signal });
  // server echoes updated movie
  return data as UpdateMoviePayload;
}
