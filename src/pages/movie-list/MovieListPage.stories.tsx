import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieListPage from './MovieListPage';
import { moviesHandlers } from '../../test/msw/handlers.ts';
import { http, HttpResponse } from 'msw';
import { passthroughHandlers } from '../../test/msw/passthroughHandlers.ts';

const meta = {
  title: 'Pages/MovieListPage',
  component: MovieListPage,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: moviesHandlers }, // ✅ attach
  },
} satisfies Meta<typeof MovieListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [...passthroughHandlers, ...moviesHandlers],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        ...passthroughHandlers,
        http.get(/\/movies(\?.*)?$/, () =>
          HttpResponse.json({ data: [], total: 0, offset: 0, limit: 30 }),
        ),
      ],
    },
  },
};
