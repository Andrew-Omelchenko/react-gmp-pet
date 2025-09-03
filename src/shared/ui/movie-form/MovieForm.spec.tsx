import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieForm, { type MovieInitial, type MovieSubmit } from './MovieForm';

describe('MovieForm', () => {
  const initial: MovieInitial = {
    id: 1,
    title: 'Interstellar',
    imageUrl: 'https://example.com/poster.jpg',
    year: 2014,
    rating: 8.6,
    duration: '2h 49m',
    genres: ['Sci-Fi', 'Adventure'],
    description: 'A team travels through a wormhole.',
  };

  it('renders initial values when provided', () => {
    const onSubmit = jest.fn();
    render(<MovieForm initial={initial} onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Interstellar');
    expect(screen.getByLabelText(/poster url/i)).toHaveValue('https://example.com/poster.jpg');
    expect(screen.getByLabelText(/year/i)).toHaveValue(2014);
    expect(screen.getByLabelText(/rating/i)).toHaveValue(8.6);
    expect(screen.getByLabelText(/duration/i)).toHaveValue('2h 49m');
    expect(screen.getByLabelText(/genres/i)).toHaveValue('Sci-Fi, Adventure');
    expect(screen.getByLabelText(/description/i)).toHaveValue('A team travels through a wormhole.');
  });

  it('submits parsed values when user fills the form', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn<void, [MovieSubmit]>();

    render(<MovieForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), 'Inception');
    await user.type(screen.getByLabelText(/poster url/i), 'https://ex.com/inception.jpg');
    await user.type(screen.getByLabelText(/year/i), '2010');
    await user.type(screen.getByLabelText(/rating/i), '8.8');
    await user.type(screen.getByLabelText(/duration/i), '2h 28m');
    await user.type(screen.getByLabelText(/genres/i), 'Action, Sci-Fi');
    await user.type(screen.getByLabelText(/description/i), 'A mind-bending heist.');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      id: undefined,
      title: 'Inception',
      imageUrl: 'https://ex.com/inception.jpg',
      year: 2010,
      rating: 8.8,
      duration: '2h 28m',
      genres: ['Action', 'Sci-Fi'],
      description: 'A mind-bending heist.',
    });
  });

  it('handles empty optional numeric fields gracefully', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn<void, [MovieSubmit]>();
    render(<MovieForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), 'No Numbers');
    await user.type(screen.getByLabelText(/poster url/i), 'https://ex.com/no.jpg');
    // leave year & rating empty
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'No Numbers',
        imageUrl: 'https://ex.com/no.jpg',
        year: undefined,
        rating: undefined,
      }),
    );
  });
});
