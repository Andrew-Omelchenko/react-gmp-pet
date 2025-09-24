import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
  onSubmit: (data: MovieSubmit) => void | Promise<void>;
  initial?: MovieInitial;
};

const Schema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(1, 'Title is required'),
  imageUrl: z.url('Poster URL must be a valid URL'),

  year: z
    .string()
    .optional()
    .refine((s) => !s || (/^\d{4}$/.test(s) && Number(s) >= 1888), {
      message: 'Year must be a 4-digit number ≥ 1888',
    }),

  rating: z
    .string()
    .optional()
    .refine(
      (s) => {
        if (!s) return true;
        const n = Number(s);
        return !Number.isNaN(n) && n >= 0 && n <= 10;
      },
      { message: 'Rating must be a number between 0 and 10' },
    ),

  duration: z.string(),
  genres: z.string(),
  description: z.string(),
});

type FormInput = z.input<typeof Schema>;
type FormOutput = z.output<typeof Schema>;

export default function MovieForm({ initial, onSubmit }: MovieFormProps) {
  const formId = React.useId();

  const defaults: FormInput = {
    id: initial?.id,
    title: initial?.title ?? '',
    imageUrl: initial?.imageUrl ?? '',
    year: initial?.year != null ? String(initial.year) : '',
    rating: initial?.rating != null ? String(initial.rating) : '',
    duration: initial?.duration ?? '',
    genres: (initial?.genres ?? []).join(', '),
    description: initial?.description ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(Schema),
    defaultValues: defaults,
  });

  const onValid: SubmitHandler<FormInput> = async (raw) => {
    const data: FormOutput = raw;

    const yearNum = data.year && data.year.trim() !== '' ? Number(data.year) : undefined;

    const ratingNum = data.rating && data.rating.trim() !== '' ? Number(data.rating) : undefined;

    const parsedGenres = data.genres
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const out: MovieSubmit = {
      id: data.id ?? initial?.id,
      title: data.title,
      imageUrl: data.imageUrl,
      year: yearNum,
      rating: ratingNum,
      duration: data.duration,
      genres: parsedGenres,
      description: data.description,
    };

    await onSubmit(out);
    reset(defaults);
  };

  return (
    <form
      aria-labelledby={`${formId}-title`}
      className={styles.form}
      onSubmit={handleSubmit(onValid)}
      data-testid="movie-form"
      noValidate
    >
      <h3 id={`${formId}-title`} className={styles.formTitle}>
        {initial?.id ? 'Edit movie' : 'Add movie'}
      </h3>

      {initial?.id != null && (
        <input type="hidden" {...register('id')} defaultValue={String(initial.id)} />
      )}

      <div className={styles.row}>
        <label htmlFor={`${formId}-title-input`} className={styles.label}>
          Title
        </label>
        <input
          id={`${formId}-title-input`}
          type="text"
          className={styles.input}
          placeholder="Movie title"
          {...register('title')}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-image-url`} className={styles.label}>
          Poster URL
        </label>
        <input
          id={`${formId}-image-url`}
          type="url"
          className={styles.input}
          placeholder="https://example.com/poster.jpg"
          {...register('imageUrl')}
        />
        {errors.imageUrl && <span className={styles.error}>{errors.imageUrl.message}</span>}
      </div>

      <div className={styles.rowCols}>
        <div className={styles.col}>
          <label htmlFor={`${formId}-year`} className={styles.label}>
            Year
          </label>
          <input
            id={`${formId}-year`}
            type="text"
            className={styles.input}
            placeholder="2014"
            {...register('year')}
          />
          {errors.year && <span className={styles.error}>{errors.year.message as string}</span>}
        </div>

        <div className={styles.col}>
          <label htmlFor={`${formId}-rating`} className={styles.label}>
            Rating
          </label>
          <input
            id={`${formId}-rating`}
            type="text"
            className={styles.input}
            placeholder="8.6"
            {...register('rating')}
          />
          {errors.rating && <span className={styles.error}>{errors.rating.message as string}</span>}
        </div>

        <div className={styles.col}>
          <label htmlFor={`${formId}-duration`} className={styles.label}>
            Duration
          </label>
          <input
            id={`${formId}-duration`}
            type="text"
            className={styles.input}
            placeholder="2h 49m"
            {...register('duration')}
          />
          {errors.duration && <span className={styles.error}>{errors.duration.message}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-genres`} className={styles.label}>
          Genres
        </label>
        <input
          id={`${formId}-genres`}
          type="text"
          className={styles.input}
          placeholder="Sci-Fi, Adventure"
          {...register('genres')}
        />
        {errors.genres && <span className={styles.error}>{errors.genres.message}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor={`${formId}-description`} className={styles.label}>
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          rows={4}
          className={styles.textarea}
          placeholder="Short synopsis…"
          {...register('description')}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
