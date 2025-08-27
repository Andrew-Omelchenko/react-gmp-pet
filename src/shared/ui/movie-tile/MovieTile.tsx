import React, { useState } from 'react';
import styles from './MovieTile.module.css';

export type MovieInfo = {
  id?: string | number;
  imageUrl: string;
  title: string;
  year: number;
  genres: string[];
};

export type MovieTileProps = {
  // All movie data in one object
  movie: MovieInfo;
  onClick: (movie: MovieInfo) => void;
  // Optional callbacks to show context menu
  onEdit?: (movie: MovieInfo) => void;
  onDelete?: (movie: MovieInfo) => void;
};

export default function MovieTile({ movie, onClick, onEdit, onDelete }: MovieTileProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasMenu = Boolean(onEdit || onDelete);

  const toggleMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setMenuOpen((s) => !s);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(movie);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(movie);
  };

  return (
    <article
      className={styles.tile}
      data-testid="movie-tile"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(movie);
        }
      }}
    >
      <div className={styles.imageWrap}>
        {/* alt should be meaningful for screen readers */}
        <img
          className={styles.image}
          src={movie.imageUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
        {hasMenu && (
          <div className={styles.menu}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label="Open menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
              data-testid="menu-button"
            >
              ⋯
            </button>

            {menuOpen && (
              <div
                className={styles.menuList}
                role="menu"
                aria-label="Movie actions"
                data-testid="menu"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    role="menuitem"
                    onClick={handleEdit}
                    data-testid="menu-edit"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    role="menuitem"
                    onClick={handleDelete}
                    data-testid="menu-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.year} aria-label="Release year">
            {movie.year}
          </span>
          <span className={styles.genres} aria-label="Genres">
            {movie.genres.join(', ')}
          </span>
        </div>
      </div>
    </article>
  );
}
