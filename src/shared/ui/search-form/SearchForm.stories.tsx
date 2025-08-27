import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchForm from './SearchForm';

const meta = {
  title: 'Shared/SearchForm',
  component: SearchForm,
  args: {
    initialQuery: 'Matrix',
    onSearch: (query) => {
      console.log(`Search Query: ${query}`);
    },
  },
  argTypes: {
    initialQuery: { control: 'text' },
    onSearch: { action: 'onSearch' },
  },
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const EmptyInitial: Story = {
  args: { initialQuery: '' },
};
