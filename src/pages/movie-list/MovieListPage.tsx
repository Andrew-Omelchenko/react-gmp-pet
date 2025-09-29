import * as React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './MovieListPage.module.css';

import { GenreSelect } from '../../shared/ui/genre-select';
import { SortControl, type SortValue } from '../../shared/ui/sort-control';
import { MovieTile, type MovieInfo } from '../../shared/ui/movie-tile';
import { fetchMovies } from '../../core/api/movies.ts';

export type UiMovie = MovieInfo & {
  rating: number;
  duration: string;
  description: string;
};

const STATIC_GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'] as const;

function coerceSort(v: string | null): SortValue {
  return v === 'title' || v === 'releaseDate' ? v : 'releaseDate';
}
function coerceGenre(v: string | null): string {
  return v && v.length ? v : 'All';
}

export default function MovieListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') ?? '';
  const activeGenre = coerceGenre(searchParams.get('genre'));
  const sort = coerceSort(searchParams.get('sort'));

  const [movies, setMovies] = React.useState<UiMovie[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const patchParams = React.useCallback(
    (patch: Record<string, string | null | undefined>) => {
      const next = new URLSearchParams(searchParams);
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === '') next.delete(k);
        else next.set(k, v);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    setLoading(true);
    setError(null);

    fetchMovies({
      query,
      sort,
      genre: activeGenre,
      offset: 0,
      limit: 30,
      signal: controller.signal,
    })
      .then((resp) => {
        if (!alive) return;
        setMovies(resp.data as UiMovie[]);
      })
      .catch((err) => {
        if (!alive || controller.signal.aborted) return;
        setError(err?.message ?? 'Failed to load movies');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [query, sort, activeGenre]);

  return (
    <div className={styles.page} data-testid="movie-list-page">
      <div className={styles.header}>
        {/* Child routes render here: Search header (index) or MovieDetails header (/:movieId) */}
        <Outlet />
      </div>

      <div className={styles.controls}>
        <GenreSelect
          genres={STATIC_GENRES as unknown as string[]}
          selected={activeGenre}
          onSelect={(g) => patchParams({ genre: g })}
        />
        <SortControl value={sort} onChange={(v) => patchParams({ sort: v })} />
      </div>

      {loading && <p className={styles.info}>Loading…</p>}
      {error && !loading && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.grid} aria-label="Movie list">
        {!loading && !error && movies.length === 0 ? (
          <p className={styles.empty}>No movies found.</p>
        ) : (
          movies.map((m) => (
            <MovieTile
              key={m.id}
              movie={{
                id: m.id,
                imageUrl: m.imageUrl,
                title: m.title,
                year: m.year,
                genres: m.genres,
              }}
              onClick={() =>
                navigate({
                  pathname: `/${m.id}`,
                  search: searchParams.toString(),
                })
              }
              onEdit={(movie) =>
                navigate({
                  pathname: `/${movie.id}/edit`,
                  search: searchParams.toString(),
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
