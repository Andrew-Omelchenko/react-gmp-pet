import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieTile, { type MovieInfo } from './MovieTile';
import { within } from 'storybook/test';

const movie: MovieInfo = {
  id: 1,
  imageUrl: 'https://example.com/poster.jpg',
  title: 'Interstellar',
  year: 2014,
  genres: ['Sci-Fi', 'Adventure'],
};

describe('MovieTile', () => {
  it('renders poster, title, year, and genres', () => {
    const onClick = jest.fn();
    render(<MovieTile movie={movie} onClick={onClick} />);

    // image alt text contains title
    const img = screen.getByRole('img', { name: /interstellar poster/i });
    expect(img).toBeInTheDocument();

    // title, year, genres visible
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
    expect(screen.getByLabelText(/release year/i)).toHaveTextContent('2014');
    expect(screen.getByLabelText(/genres/i)).toHaveTextContent('Sci-Fi, Adventure');
  });

  it('calls onClick when tile is clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<MovieTile movie={movie} onClick={onClick} />);

    await user.click(screen.getByTestId('movie-tile'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(movie);
  });

  it('shows context menu and triggers onEdit/onDelete', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<MovieTile movie={movie} onClick={onClick} onEdit={onEdit} onDelete={onDelete} />);

    // open the menu
    await user.click(screen.getByRole('button', { name: /open menu/i }));

    // first, wait for the menu container
    const menu = await screen.findByRole('menu', { name: /movie actions/i });

    // then query inside the menu only
    const editBtn = within(menu).getByRole('menuitem', { name: /edit/i });

    await user.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(movie);

    // reopen and delete
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const menu2 = await screen.findByRole('menu', { name: /movie actions/i });
    await user.click(within(menu2).getByRole('menuitem', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(movie);

    // ensure tile click wasn't triggered by menu interactions
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not render menu when no menu callbacks are provided', () => {
    const onClick = jest.fn();
    render(<MovieTile movie={movie} onClick={onClick} />);
    // menu button should not be present
    expect(screen.queryByRole('button', { name: /open menu/i })).not.toBeInTheDocument();
  });
});
