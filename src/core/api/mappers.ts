import type { ApiMovie } from './types.ts';
import type { UiMovie } from '../../pages/movie-list/MovieListPage.tsx';

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

export function mapUiToApiMovie(ui: Partial<UiMovie>): ApiMovie {
  return {
    id: ui.id as number,
    title: ui.title ?? '',
    poster_path: ui.imageUrl ?? '',
    overview: ui.description ?? '',
    runtime: parseDurationToMinutes(ui.duration ?? ''),
    release_date: releaseDateFromYear(ui.year),
    genres: ui.genres ?? [],
    vote_average: ui.rating,
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function parseDurationToMinutes(s?: string): number {
  if (!s) return 120;
  const h = /(\d+)\s*h/.exec(s)?.[1];
  const m = /(\d+)\s*m/.exec(s)?.[1];
  if (h || m) return (h ? parseInt(h) * 60 : 0) + (m ? parseInt(m) : 0);

  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [hh, mm] = s.split(':').map((x) => parseInt(x, 10));
    return hh * 60 + mm;
  }

  const num = parseInt(s, 10);
  return Number.isFinite(num) ? clamp(num, 1, 10000) : 120;
}

const minutesToDuration = (mins?: number) => {
  if (!mins && mins !== 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const minutesFromDuration = (s?: string): number | undefined => {
  if (!s) return undefined;
  const h = /(\d+)\s*h/i.exec(s)?.[1];
  const m = /(\d+)\s*m/i.exec(s)?.[1];
  if (h || m) return (h ? parseInt(h) * 60 : 0) + (m ? parseInt(m) : 0);
  const mm = parseInt(s, 10);
  return Number.isFinite(mm) ? mm : undefined;
};

export function releaseDateToYear(date?: string): number {
  const y = date?.slice(0, 4);
  const n = y ? parseInt(y, 10) : NaN;
  return Number.isFinite(n) ? n : 2000;
}

export const releaseDateFromYear = (y?: number) =>
  typeof y === 'number' && Number.isFinite(y) ? `${y}-01-01` : undefined;
