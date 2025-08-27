import React from 'react';
import styles from './MovieDetails.module.css';

export type MovieDetailsInfo = {
  imageUrl: string;
  title: string;
  year: number | string;
  rating: number | string;
  duration: string;
  description: string;
};

export type MovieDetailsProps = {
  // All movie data in one object
  details: MovieDetailsInfo;
};

export default function MovieDetails({ details }: MovieDetailsProps) {
  const titleId = React.useId();

  return (
    <article className={styles.details} aria-labelledby={titleId} data-testid="movie-details">
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={details.imageUrl}
          alt={`${details.title} poster`}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {details.title}
          </h2>
          <div className={styles.meta}>
            <span className={styles.year} aria-label="Release year">
              {details.year}
            </span>
            <span className={styles.rating} aria-label="Rating">
              {details.rating}
            </span>
            <span className={styles.duration} aria-label="Duration">
              {details.duration}
            </span>
          </div>
        </header>

        <p className={styles.description}>{details.description}</p>
      </div>
    </article>
  );
}
