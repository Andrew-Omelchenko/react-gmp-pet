import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import { MovieListPage } from './pages/movie-list';
import SearchRouteHeader from './pages/movie-list/SearchRoute.tsx';

import './index.css';
import MovieDetailsRouteHeader from './pages/movie-list/routes/MovieDetailsHeader.tsx';
import { movieDetailsLoader } from './pages/movie-list/loaders/movieDetailsLoader.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MovieListPage />,
        children: [
          { index: true, element: <SearchRouteHeader /> },
          { path: ':movieId', element: <MovieDetailsRouteHeader />, loader: movieDetailsLoader },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
