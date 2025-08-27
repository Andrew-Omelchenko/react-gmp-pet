import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter', () => {
  it('renders initial value provided in props', () => {
    render(<Counter initialValue={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('decrements value when clicking the decrement button', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={3} />);
    await user.click(screen.getByRole('button', { name: '-' }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('increments value when clicking the increment button', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={3} />);
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
