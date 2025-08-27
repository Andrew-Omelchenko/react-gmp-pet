import React from 'react';
import styles from './SortControl.module.css';

export type SortValue = 'releaseDate' | 'title';

export type SortControlProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export default function SortControl({ value, onChange }: SortControlProps) {
  const selectId = React.useId();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as SortValue);
  };

  return (
    <div className={styles.control} data-testid="sort-control">
      <label className={styles.label} htmlFor={selectId}>
        Sort by
      </label>

      <select
        id={selectId}
        className={styles.select}
        value={value}
        onChange={handleChange}
        aria-label="Sort by"
      >
        <option value="releaseDate">Release Date</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}
