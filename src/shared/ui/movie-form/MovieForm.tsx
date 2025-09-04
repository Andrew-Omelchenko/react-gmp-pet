import React from 'react';
import styles from './MovieForm.module.css';

export type MovieInitial = {
  id?: string | number;
  title?: string;
  imageUrl?: string;
  year?: number;
  rating?: number;
  duration?: string;
  genres?: string[];
  description?: string;
};

export type MovieSubmit = {
  id?: string | number;
  title: string;
  imageUrl: string;
  year?: number;
  rating?: number;
  duration: string;
  genres: string[];
  description: string;
};

export type MovieFormProps = {
  onSubmit: (data: MovieSubmit) => void;
  // Optional initial values (omitted for "Add movie")
  initial?: MovieInitial;
};

export default function MovieForm({ initial, onSubmit }: MovieFormProps) {
  const formId = React.useId();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, FormDataEntryValue>;

    const toNumber = (v: FormDataEntryValue | undefined) => {
      const s = (v ?? '').toString().trim();
      if (s === '') return undefined;
      const n = Number(s);
      return Number.isNaN(n) ? undefined : n;
    };

    const csvToArray = (v: FormDataEntryValue | undefined) =>
      (v ?? '')
        .toString()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const data: MovieSubmit = {
      id: raw.id ? raw.id.toString() : initial?.id, // keep id if provided
      title: (raw.title ?? '').toString(),
      imageUrl: (raw.imageUrl ?? '').toString(),
      year: toNumber(raw.year),
      rating: toNumber(raw.rating),
      duration: (raw.duration ?? '').toString(),
      genres: csvToArray(raw.genres),
      description: (raw.description ?? '').toString(),
    };

    onSubmit(data);
  };

  return (
    <form
      aria-labelledby={`${formId}-title`}
      className={styles.form}
      onSubmit={handleSubmit}
      data-testid="movie-form"
    >
      <h3 id={`${formId}-title`} className={styles.formTitle}>
        {initial?.id ? 'Edit movie' : 'Add movie'}
      </h3>

      {initial?.id != null && <input type="hidden" name="id" defaultValue={String(initial.id)} />}

      <div className={styles.row}>
        <label htmlFor={`${formId}-title-input`} className={styles.label}>
          Title
        </label>
        <input
          id={`${formId}-title-input`}
          name="title"
          type="text"
          className={styles.input}
          placeholder="Movie title"
          defaultValue={initial?.title ?? ''}
          required
        />
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-image-url`} className={styles.label}>
          Poster URL
        </label>
        <input
          id={`${formId}-image-url`}
          name="imageUrl"
          type="url"
          className={styles.input}
          placeholder="https://example.com/poster.jpg"
          defaultValue={initial?.imageUrl ?? ''}
          required
        />
      </div>

      <div className={styles.rowCols}>
        <div className={styles.col}>
          <label htmlFor={`${formId}-year`} className={styles.label}>
            Year
          </label>
          <input
            id={`${formId}-year`}
            name="year"
            type="number"
            className={styles.input}
            placeholder="2014"
            defaultValue={initial?.year ?? ''}
            min={1888}
          />
        </div>

        <div className={styles.col}>
          <label htmlFor={`${formId}-rating`} className={styles.label}>
            Rating
          </label>
          <input
            id={`${formId}-rating`}
            name="rating"
            type="number"
            step="0.1"
            className={styles.input}
            placeholder="8.6"
            defaultValue={initial?.rating ?? ''}
            min={0}
            max={10}
          />
        </div>

        <div className={styles.col}>
          <label htmlFor={`${formId}-duration`} className={styles.label}>
            Duration
          </label>
          <input
            id={`${formId}-duration`}
            name="duration"
            type="text"
            className={styles.input}
            placeholder="2h 49m"
            defaultValue={initial?.duration ?? ''}
          />
        </div>
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-genres`} className={styles.label}>
          Genres
        </label>
        <input
          id={`${formId}-genres`}
          name="genres"
          type="text"
          className={styles.input}
          placeholder="Sci-Fi, Adventure"
          defaultValue={initial?.genres?.join(', ') ?? ''}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-description`} className={styles.label}>
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={4}
          className={styles.textarea}
          placeholder="Short synopsis…"
          defaultValue={initial?.description ?? ''}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Save
        </button>
      </div>
    </form>
  );
}
