import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../../../shared/ui/dialog';
import { MovieForm, type MovieSubmit } from '../../../shared/ui/movie-form';
import { createMovie } from '../../../core/api/movies.ts';
import { mapUiToApiMovie } from '../../../core/api/mappers.ts';

export default function AddMovieRoute() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const closeToIndex = React.useCallback(() => {
    navigate({ pathname: '/', search: sp.toString() }, { replace: true });
  }, [navigate, sp]);

  const onSubmit = async (values: MovieSubmit) => {
    const payload = mapUiToApiMovie(values);
    const created = await createMovie(payload);
    navigate({ pathname: `/${created.id}`, search: sp.toString() }, { replace: true });
  };

  return (
    <Dialog title="Add Movie" onClose={closeToIndex}>
      <MovieForm onSubmit={onSubmit} />
    </Dialog>
  );
}
