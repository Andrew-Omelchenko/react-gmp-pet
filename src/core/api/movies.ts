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
