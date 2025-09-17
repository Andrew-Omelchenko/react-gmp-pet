import { type LoaderFunctionArgs } from 'react-router-dom';
import { fetchMovieById } from '../../../core/api/movies.ts';

export type MovieDetailsDTO = {
  imageUrl: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  description: string;
};

export async function movieDetailsLoader({ params, request }: LoaderFunctionArgs) {
  const id = params.movieId!;
  const abort = new AbortController();
  request.signal.addEventListener('abort', () => abort.abort(), { once: true });

  const movie = await fetchMovieById(id, abort.signal);

  const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0;
  const duration =
    typeof movie.runtime === 'number'
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : '';

  const dto: MovieDetailsDTO = {
    imageUrl: movie.poster_path,
    title: movie.title,
    year,
    rating: movie.vote_average ?? 0,
    duration,
    description: movie.overview ?? '',
  };

  return dto;
}
