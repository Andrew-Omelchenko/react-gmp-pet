import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieListPage from './MovieListPage';
import { fetchMovies } from '../../core/api/movies.ts';

jest.mock('../../core/api/movies', () => ({
  fetchMovies: jest.fn(),
}));

type UiMovie = {
  id: number;
  imageUrl: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  duration: string;
  description: string;
};
type ApiResp = { data: UiMovie[]; total: number; offset: number; limit: number };

const makeResp = (movies: UiMovie[]): ApiResp => ({
  data: movies,
  total: movies.length,
  offset: 0,
  limit: 30,
});

const MOVIES: UiMovie[] = [
  {
    id: 1,
    imageUrl: 'x',
    title: 'Interstellar',
    year: 2014,
    genres: ['Sci-Fi'],
    rating: 8.6,
    duration: '2h',
    description: 'd',
  },
  {
    id: 2,
    imageUrl: 'x',
    title: 'Arrival',
    year: 2016,
    genres: ['Sci-Fi'],
    rating: 7.9,
    duration: '2h',
    description: 'd',
  },
  {
    id: 3,
    imageUrl: 'x',
    title: 'Toy Story',
    year: 1995,
    genres: ['Comedy'],
    rating: 8.3,
    duration: '1h',
    description: 'd',
  },
];

describe('MovieListPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads movies on mount and renders tiles', async () => {
    (fetchMovies as jest.Mock).mockResolvedValueOnce(makeResp(MOVIES));

    render(<MovieListPage />);

    // called with initial params
    expect(fetchMovies).toHaveBeenCalledWith(
      expect.objectContaining({
        query: '',
        sort: 'releaseDate',
        genre: 'All',
        offset: 0,
        limit: 30,
        signal: expect.any(AbortSignal),
      }),
    );

    // tiles render from mock response
    const tiles = await screen.findAllByTestId('movie-tile');
    expect(tiles).toHaveLength(3);
    within(tiles[0]).getByText(/interstellar/i);
  });

  it('updates query on submit and refetches', async () => {
    (fetchMovies as jest.Mock)
      .mockResolvedValueOnce(makeResp(MOVIES)) // initial load
      .mockResolvedValueOnce(makeResp([MOVIES[0]])); // after search: Interstellar only

    const user = userEvent.setup();
    render(<MovieListPage />);

    await screen.findAllByTestId('movie-tile');

    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.clear(input);
    await user.type(input, 'Interstellar{enter}');

    expect(fetchMovies).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'Interstellar' }),
    );

    const tiles2 = await screen.findAllByTestId('movie-tile');
    expect(tiles2).toHaveLength(1);
    within(tiles2[0]).getByText('Interstellar');
  });

  it('uses only the latest response (simulated cancel/abort)', async () => {
    // controllable promises to simulate race
    let resolve1!: (v: ApiResp) => void;
    const p1 = new Promise<ApiResp>((res) => (resolve1 = res));

    let resolve2!: (v: ApiResp) => void;
    const p2 = new Promise<ApiResp>((res) => (resolve2 = res));

    (fetchMovies as jest.Mock)
      .mockReturnValueOnce(p1) // initial (pending)
      .mockReturnValueOnce(p2); // after search (pending)

    const user = userEvent.setup();
    render(<MovieListPage />);

    // quickly update query before first resolves
    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.type(input, 'Arrival{enter}');

    // resolve the *old* request with "Toy Story" — should be ignored
    resolve1(makeResp([MOVIES[2]]));

    // resolve the *latest* request with "Arrival" — should win
    resolve2(makeResp([MOVIES[1]]));

    await screen.findByText('Arrival');
    expect(screen.queryByText('Toy Story')).not.toBeInTheDocument();
  });
});
