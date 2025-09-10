import React from 'react';
import styles from './MovieListPage.module.css';

import { SearchForm } from '../../shared/ui/search-form';
import { GenreSelect } from '../../shared/ui/genre-select';
import { SortControl, type SortValue } from '../../shared/ui/sort-control';
import { MovieTile, type MovieInfo } from '../../shared/ui/movie-tile';
import { MovieDetails } from '../../shared/ui/movie-details';
import { fetchMovies } from '../../core/api/movies.ts';

export type UiMovie = MovieInfo & {
  rating: number;
  duration: string;
  description: string;
};

const STATIC_GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'] as const;

export default function MovieListPage() {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<SortValue>('releaseDate');
  const [activeGenre, setActiveGenre] = React.useState<string>('All');

  const [movies, setMovies] = React.useState<UiMovie[]>([]);
  const [selected, setSelected] = React.useState<UiMovie | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
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
        setMovies(resp.data as UiMovie[]);
        if (selected && !resp.data.some((m) => m.id === selected.id)) {
          setSelected(null);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(err?.message ?? 'Failed to load movies');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, sort, activeGenre]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.page} data-testid="movie-list-page">
      <div className={styles.header}>
        {selected ? (
          <MovieDetails
            details={{
              imageUrl: selected.imageUrl,
              title: selected.title,
              year: selected.year,
              rating: selected.rating,
              duration: selected.duration,
              description: selected.description,
            }}
          />
        ) : (
          <SearchForm initialQuery={query} onSearch={(q) => setQuery(q)} />
        )}
      </div>

      <div className={styles.controls}>
        <GenreSelect
          genres={STATIC_GENRES as unknown as string[]}
          selected={activeGenre}
          onSelect={(g) => setActiveGenre(g)}
        />
        <SortControl value={sort} onChange={setSort} />
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
              onClick={() => setSelected(m)}
            />
          ))
        )}
      </div>
    </div>
  );
}
