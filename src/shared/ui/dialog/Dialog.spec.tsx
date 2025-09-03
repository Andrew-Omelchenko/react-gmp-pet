import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from './Dialog';

describe('Dialog', () => {
  it('renders title and children in a modal dialog (portal)', () => {
    render(
      <Dialog title="Edit Movie" onClose={jest.fn()}>
        <p>Body content</p>
      </Dialog>,
    );

    // role=dialog + accessible name via heading
    const dialog = screen.getByRole('dialog', { name: /edit movie/i });
    expect(dialog).toBeInTheDocument();

    // body content visible
    expect(screen.getByText('Body content')).toBeInTheDocument();

    // overlay exists
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Dialog title="Details" onClose={onClose}>
        <div>Text</div>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the close button on mount (focus trap initial focus)', async () => {
    render(
      <Dialog title="Focus Test" onClose={jest.fn()}>
        <div>Focus body</div>
      </Dialog>,
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    await waitFor(() => expect(closeBtn).toHaveFocus());
  });

  it('calls onClose when pressing Escape', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Dialog title="Esc Test" onClose={onClose}>
        <div>Esc body</div>
      </Dialog>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
