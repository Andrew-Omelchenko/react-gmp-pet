import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieDetails, { type MovieDetailsInfo } from './MovieDetails';

const DETAILS: MovieDetailsInfo = {
  imageUrl: 'https://picsum.photos/300/450?random=2',
  title: 'Inception',
  year: 2010,
  rating: 8.8,
  duration: '2h 28m',
  description:
    'A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea.',
};

const meta = {
  title: 'Shared/MovieDetails',
  component: MovieDetails,
  args: {
    details: DETAILS,
  },
  argTypes: {
    details: { control: 'object' },
  },
} satisfies Meta<typeof MovieDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithCustomRating: Story = {
  args: { details: { ...DETAILS, rating: 9.2 } },
};
