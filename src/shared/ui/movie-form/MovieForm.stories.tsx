import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieForm, { type MovieInitial } from './MovieForm';

const initial: MovieInitial = {
  id: 1,
  title: 'Interstellar',
  imageUrl: 'https://picsum.photos/300/450?blur=1',
  year: 2014,
  rating: 8.6,
  duration: '2h 49m',
  genres: ['Sci-Fi', 'Adventure'],
  description:
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
};

const meta = {
  title: 'Shared/MovieForm',
  component: MovieForm,
  args: {
    initial,
    onSubmit: () => console.log('onSubmit'),
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MovieForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditMovie: Story = {};

export const AddMovie: Story = {
  args: { initial: undefined },
};
