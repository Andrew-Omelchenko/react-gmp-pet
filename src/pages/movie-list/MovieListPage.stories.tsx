import type { Meta, StoryObj } from '@storybook/react-vite';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import MovieListPage from './MovieListPage';
import SearchRouteHeader from './SearchRoute';
import MovieDetailsRouteHeader from './routes/MovieDetailsHeader';
import { movieDetailsLoader } from './loaders/movieDetailsLoader';
import AddMovieRoute from './routes/AddMovieRoute';
import EditMovieRoute from './routes/EditMovieRoute';

import { moviesHandlers } from '../../test/msw/handlers';
import { passthroughHandlers } from '../../test/msw/passthroughHandlers';

type RouterArgs = { initialUrl: string };

function MovieListWithRouter({ initialUrl }: RouterArgs) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <MovieListPage />,
        children: [
          // Search header layout -> "/" and "/new"
          {
            element: <SearchRouteHeader />,
            children: [
              { index: true, element: <></> }, // "/" renders SearchForm in header
              { path: 'new', element: <AddMovieRoute /> }, // "/new" overlays Dialog+MovieForm
            ],
          },

          // Details header layout -> "/:movieId" and "/:movieId/edit"
          {
            id: 'movie-details',
            path: ':movieId',
            element: <MovieDetailsRouteHeader />,
            loader: movieDetailsLoader,
            children: [
              { path: 'edit', element: <EditMovieRoute /> }, // "/:movieId/edit" overlays Dialog+MovieForm
            ],
          },
        ],
      },
    ],
    { initialEntries: [initialUrl] },
  );

  return <RouterProvider router={router} />;
}

const meta = {
  title: 'Pages/MovieListPage',
  component: MovieListWithRouter,
  args: { initialUrl: '/' },
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: [...passthroughHandlers, ...moviesHandlers] },
  },
} satisfies Meta<typeof MovieListWithRouter>;

export default meta;
type Story = StoryObj<typeof MovieListWithRouter>;

export const Default: Story = { args: { initialUrl: '/' } };

export const WithQueryGenreSort: Story = {
  args: { initialUrl: '/?query=Matrix&genre=Crime&sort=title' },
};

export const DetailsDeepLink: Story = {
  args: { initialUrl: '/5?query=Matrix&genre=Crime&sort=title' },
};

// NEW stories to quickly test dialogs in SB

export const AddModal: Story = {
  args: { initialUrl: '/new?query=Matrix&genre=Crime&sort=title' },
};

export const EditModalDeepLink: Story = {
  args: { initialUrl: '/5/edit?query=Matrix&genre=Crime&sort=title' },
};
