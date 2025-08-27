import type { Meta, StoryObj } from '@storybook/react-vite';
import Counter from './Counter';

const meta = {
  title: 'Shared/Counter',
  component: Counter,
  args: {
    initialValue: 0,
  },
  argTypes: {
    initialValue: { control: { type: 'number', min: -10, max: 10, step: 1 } },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithInitial5: Story = {
  args: { initialValue: 5 },
};
