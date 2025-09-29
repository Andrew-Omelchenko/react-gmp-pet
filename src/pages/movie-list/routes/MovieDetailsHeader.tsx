import { Outlet, useLoaderData } from 'react-router-dom';
import { MovieDetails } from '../../../shared/ui/movie-details';

export type MovieDetailsDTO = {
  imageUrl: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  description: string;
};

export default function MovieDetailsRouteHeader() {
  const details = useLoaderData() as MovieDetailsDTO;
  return (
    <>
      <MovieDetails details={details} />
      <Outlet />
    </>
  );
}
