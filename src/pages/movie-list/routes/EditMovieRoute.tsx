import * as React from 'react';
import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { Dialog } from '../../../shared/ui/dialog';
import { MovieForm, type MovieSubmit } from '../../../shared/ui/movie-form';
import { updateMovie } from '../../../core/api/movies.ts';
import type { EditInitial } from '../loaders/editMovieLoader';
import { mapUiToApiMovie } from '../../../core/api/mappers.ts';

export default function EditMovieRoute() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { movieId } = useParams();
  const initial = useLoaderData() as EditInitial;
  const parentData = useRouteLoaderData('movie-details') as EditInitial;

  const handleClose = React.useCallback(() => {
    // go back if possible; else fall back to details or index preserving search params
    if (window.history.length > 1) navigate(-1);
    else
      navigate(
        { pathname: movieId ? `/${movieId}` : '/', search: sp.toString() },
        { replace: true },
      );
  }, [navigate, sp, movieId]);

  const onSubmit = async (values: MovieSubmit) => {
    const payload = mapUiToApiMovie(values);
    await updateMovie(payload);
    // show updated details; keep current query params
    navigate({ pathname: `/${payload.id}`, search: sp.toString() }, { replace: true });
  };

  return (
    <Dialog title="Edit Movie" onClose={handleClose}>
      <MovieForm initial={initial ?? { ...parentData, id: movieId }} onSubmit={onSubmit} />
    </Dialog>
  );
}
