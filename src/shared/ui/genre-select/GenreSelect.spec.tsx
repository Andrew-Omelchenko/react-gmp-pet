import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreSelect from './GenreSelect';

describe('GenreSelect', () => {
  const GENRES = ['ALL', 'DOCUMENTARY', 'COMEDY', 'HORROR', 'CRIME'];

  it('renders all genres passed in props', () => {
    render(<GenreSelect genres={GENRES} selected="ALL" onSelect={jest.fn()} />);
    GENRES.forEach((genre) => {
      expect(screen.getByRole('button', { name: genre })).toBeInTheDocument();
    });
  });

  it('highlights the selected genre', () => {
    render(<GenreSelect genres={GENRES} selected="COMEDY" onSelect={jest.fn()} />);

    const active = screen.getByRole('button', { name: 'COMEDY' });
    expect(active).toHaveAttribute('aria-current', 'true');
    expect(active).toHaveClass('active');

    const notActive = screen.getByRole('button', { name: 'HORROR' });
    expect(notActive).not.toHaveAttribute('aria-current', 'true');
    expect(notActive).not.toHaveClass('active');
  });

  it('calls onSelect with correct genre on click', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(<GenreSelect genres={GENRES} selected="ALL" onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'HORROR' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('HORROR');
  });
});
