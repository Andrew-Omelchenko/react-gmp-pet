import type { Meta, StoryObj } from '@storybook/react-vite';
import Dialog from './Dialog';

const meta = {
  title: 'Shared/Dialog',
  component: Dialog,
  args: {
    title: 'Edit Movie',
    children: (
      <div>
        <p>This is a sample dialog body. Put any JSX here.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    ),
    onClose: () => console.log('onClose'),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithJSXTitle: Story = {
  args: {
    title: (
      <span>
        <strong>Custom</strong> Title
      </span>
    ),
  },
};
