import type { ApiMovie } from './types.ts';
import type { UiMovie } from '../../pages/movie-list/MovieListPage.tsx';

const minutesToDuration = (mins?: number) => {
  if (!mins && mins !== 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export function mapApiMovieToUi(m: ApiMovie): UiMovie {
  const year = m.release_date ? Number(m.release_date.slice(0, 4)) : NaN;
  return {
    id: m.id,
    imageUrl: m.poster_path,
    title: m.title,
    year: Number.isNaN(year) ? 0 : year,
    genres: m.genres ?? [],
    rating: m.vote_average ?? 0,
    duration: minutesToDuration(m.runtime),
    description: m.overview ?? '',
  };
}
