import React from 'react';
import styles from './GenreSelect.module.css';

export type GenreSelectProps = {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
};

export default function GenreSelect({ genres, selected, onSelect }: GenreSelectProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Tab') {
      const dir = e.shiftKey ? -1 : 1;
      const nextIndex = index + dir;

      if (nextIndex >= 0 && nextIndex < genres.length) {
        onSelect(genres[nextIndex]);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {genres.map((g, i) => {
          const isActive = g === selected;
          return (
            <button
              key={g}
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(g)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              aria-current={isActive ? 'true' : undefined}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
