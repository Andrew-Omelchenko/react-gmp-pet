import type { Meta, StoryObj } from '@storybook/react-vite';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import MovieListPage from './MovieListPage';
import SearchRouteHeader from './SearchRoute';
import MovieDetailsRouteHeader from './routes/MovieDetailsHeader';
import { movieDetailsLoader } from './loaders/movieDetailsLoader';

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
          { index: true, element: <SearchRouteHeader /> },
          { path: ':movieId', element: <MovieDetailsRouteHeader />, loader: movieDetailsLoader },
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
