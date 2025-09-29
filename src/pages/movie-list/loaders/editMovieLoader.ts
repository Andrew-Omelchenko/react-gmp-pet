import type { LoaderFunctionArgs } from 'react-router-dom';
import { fetchMovieById } from '../../../core/api/movies.ts';

export type EditInitial = {
  id?: string | number;
  title?: string;
  imageUrl?: string;
  year?: number;
  rating?: number;
  duration?: string;
  genres?: string[];
  description?: string;
};

const yearFromReleaseDate = (d?: string) => {
  const y = d?.slice(0, 4);
  return y ? Number(y) : undefined;
};
const durationFromMinutes = (min?: number) => {
  if (!min && min !== 0) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
};

export async function editMovieLoader({ params, request }: LoaderFunctionArgs) {
  const id = params.movieId!;
  const abort = new AbortController();
  request.signal.addEventListener('abort', () => abort.abort(), { once: true });

  const api = await fetchMovieById(id, abort.signal);

  const initial: EditInitial = {
    id: api.id,
    title: api.title,
    imageUrl: api.poster_path,
    year: yearFromReleaseDate(api.release_date),
    rating: api.vote_average,
    duration: durationFromMinutes(api.runtime),
    genres: api.genres ?? [],
    description: api.overview ?? '',
  };

  return initial;
}
