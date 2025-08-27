import type { Meta, StoryObj } from '@storybook/react-vite';
import GenreSelect from './GenreSelect';

const GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'];

const meta = {
  title: 'Shared/GenreSelect',
  component: GenreSelect,
  args: {
    genres: GENRES,
    selected: 'All',
    onSelect: (genre) => {
      console.log(`Selected Genre: ${genre}`);
    },
  },
  argTypes: {
    selected: { control: { type: 'radio' }, options: GENRES },
    genres: { control: 'object' },
    onSelect: { action: 'onSelect' },
  },
} satisfies Meta<typeof GenreSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSelected: Story = {};
export const ComedySelected: Story = { args: { selected: 'Comedy' } };
