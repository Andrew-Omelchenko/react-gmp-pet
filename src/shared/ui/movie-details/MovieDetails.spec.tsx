import { render, screen } from '@testing-library/react';
import MovieDetails, { type MovieDetailsInfo } from './MovieDetails';

const details: MovieDetailsInfo = {
  imageUrl: 'https://example.com/poster.jpg',
  title: 'Interstellar',
  year: 2014,
  rating: 8.6,
  duration: '2h 49m',
  description:
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
};

describe('MovieDetails', () => {
  it('renders poster, title, year, rating, duration, and description', () => {
    render(<MovieDetails details={details} />);

    // poster alt text contains title
    expect(screen.getByRole('img', { name: /interstellar poster/i })).toBeInTheDocument();

    // title
    expect(screen.getByRole('heading', { name: 'Interstellar' })).toBeInTheDocument();

    // meta fields with accessible labels
    expect(screen.getByLabelText(/release year/i)).toHaveTextContent('2014');
    expect(screen.getByLabelText(/rating/i)).toHaveTextContent('8.6');
    expect(screen.getByLabelText(/duration/i)).toHaveTextContent('2h 49m');

    // description
    expect(screen.getByText(/team of explorers travel through a wormhole/i)).toBeInTheDocument();
  });

  it('exposes a stable test id for the container', () => {
    render(<MovieDetails details={details} />);
    expect(screen.getByTestId('movie-details')).toBeInTheDocument();
  });
});
