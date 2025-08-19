import React, { useEffect, useState } from 'react';
import styles from './SearchForm.module.css';

export type SearchFormProps = {
  initialQuery?: string;
  onSearch: (query: string) => void;
};

export default function SearchForm({ initialQuery = '', onSearch }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onSearch(query);
  };

  return (
    <form className={styles.form} onSubmit={submit} role="search" aria-label="Search">
      <input
        className={styles.input}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to watch?"
        aria-label="Search query"
      />
      <button className={styles.button} type="submit">
        SEARCH
      </button>
    </form>
  );
}
