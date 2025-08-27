import type { Meta, StoryObj } from '@storybook/react-vite';
import SortControl, { type SortValue } from './SortControl';

const meta = {
  title: 'Shared/SortControl',
  component: SortControl,
  args: {
    value: 'releaseDate' as SortValue,
    onChange: (v) => console.log('sort changed:', v),
  },
  argTypes: {
    value: {
      control: { type: 'radio' },
      options: ['releaseDate', 'title'],
      description: 'Current sort value',
    },
    onChange: { action: 'onChange', description: 'Called with new SortValue' },
  },
} satisfies Meta<typeof SortControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReleaseDate: Story = {};

export const Title: Story = {
  args: { value: 'title' },
};
