import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieTile, { type MovieInfo } from './MovieTile';

const SAMPLE_MOVIE: MovieInfo = {
  id: 1,
  imageUrl: 'https://picsum.photos/300/450?random=1',
  title: 'Interstellar',
  year: 2014,
  genres: ['Sci-Fi', 'Adventure'],
};

const meta = {
  title: 'Shared/MovieTile',
  component: MovieTile,
  args: {
    movie: SAMPLE_MOVIE,
    onClick: (m) => console.log('Clicked:', m),
  },
  argTypes: {
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
    movie: { control: 'object' },
  },
} satisfies Meta<typeof MovieTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithMenu: Story = {
  args: {
    onEdit: (m) => console.log('Edit:', m),
    onDelete: (m) => console.log('Delete:', m),
  },
};
