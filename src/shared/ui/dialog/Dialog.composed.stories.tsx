import type { Meta, StoryObj } from '@storybook/react-vite';
import Dialog from './Dialog';
import MovieForm, { type MovieInitial, type MovieSubmit } from '../movie-form/MovieForm';

type Variant = 'add' | 'edit' | 'delete';

type MovieDialogDemoProps = {
  variant: Variant;
  initial?: MovieInitial;
  onClose: () => void;
  onSubmit: (data: MovieSubmit) => void;
  onConfirm: () => void;
};

const SAMPLE_INITIAL: MovieInitial = {
  id: 42,
  title: 'Interstellar',
  imageUrl: 'https://picsum.photos/300/450?random=4',
  year: 2014,
  rating: 8.6,
  duration: '2h 49m',
  genres: ['Sci-Fi', 'Adventure'],
  description:
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
};

function MovieDialogDemo({ variant, initial, onClose, onSubmit, onConfirm }: MovieDialogDemoProps) {
  if (variant === 'delete') {
    return (
      <Dialog title="Delete Movie" onClose={onClose}>
        <p>Are you sure you want to delete this movie?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={onConfirm} style={{ padding: '8px 14px' }}>
            CONFIRM
          </button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog title={''} onClose={onClose}>
      <MovieForm initial={variant === 'edit' ? initial : undefined} onSubmit={onSubmit} />
    </Dialog>
  );
}

const meta = {
  title: 'Composed/Movie Dialogs',
  component: MovieDialogDemo,
  args: {
    variant: 'add' as Variant,
    initial: SAMPLE_INITIAL,
    onClose: () => console.log('onClose'),
    onSubmit: () => console.log('onSubmit'),
    onConfirm: () => console.log('onConfirm'),
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['add', 'edit', 'delete'],
    },
    onClose: { action: 'onClose' },
    onSubmit: { action: 'onSubmit' },
    onConfirm: { action: 'onConfirm' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MovieDialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddMovie: Story = {
  args: { variant: 'add', initial: undefined },
};

export const EditMovie: Story = {
  args: { variant: 'edit' },
};

export const DeleteMovie: Story = {
  args: { variant: 'delete' },
};
