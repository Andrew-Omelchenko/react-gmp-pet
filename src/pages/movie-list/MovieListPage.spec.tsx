import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import MovieListPage from './MovieListPage';
import { fetchMovies } from '../../core/api/movies.ts';
import SearchRouteHeader from './SearchRoute.tsx';

jest.mock('../../core/api/movies.ts', () => ({ fetchMovies: jest.fn() }));

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

function renderWithRouter(initialPath = '/', firstResponse = makeResp(MOVIES)) {
  (fetchMovies as jest.Mock).mockResolvedValueOnce(firstResponse);

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <MovieListPage />,
        children: [{ index: true, element: <SearchRouteHeader /> }],
      },
    ],
    { initialEntries: [initialPath] },
  );

  const ui = render(<RouterProvider router={router} />);
  return { router, ...ui };
}

describe('MovieListPage (URL state via useSearchParams)', () => {
  beforeEach(() => jest.resetAllMocks());

  it('hydrates from URL on first render', async () => {
    const resp = makeResp([
      {
        id: 5,
        imageUrl: 'x',
        title: 'The Matrix',
        year: 1999,
        genres: ['Crime', 'Sci-Fi'],
        rating: 8.7,
        duration: '2h',
        description: 'd',
      },
    ]);
    const { router } = renderWithRouter('/?query=Matrix&genre=Crime&sort=title', resp);

    // fetch called with URL-derived params
    expect(fetchMovies).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Matrix',
        genre: 'Crime',
        sort: 'title',
        signal: expect.any(AbortSignal),
      }),
    );

    // UI reflects URL params
    await screen.findByText('The Matrix');
    expect(screen.getByRole('searchbox', { name: /search query/i })).toHaveValue('Matrix');
    expect(screen.getByRole('button', { name: /crime/i })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByLabelText(/sort by/i)).toHaveValue('title');

    // router location unchanged
    expect(router.state.location.search).toContain('query=Matrix');
    expect(router.state.location.search).toContain('genre=Crime');
    expect(router.state.location.search).toContain('sort=title');
  });

  it('updates URL when searching and refetches', async () => {
    const user = userEvent.setup();
    // initial load
    const { router } = renderWithRouter('/', makeResp(MOVIES));
    await screen.findAllByTestId('movie-tile');

    // next response after search: only Interstellar
    (fetchMovies as jest.Mock).mockResolvedValueOnce(makeResp([MOVIES[0]]));

    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.clear(input);
    await user.type(input, 'Interstellar{enter}');

    // URL updated
    expect(router.state.location.search).toContain('query=Interstellar');
    // backend called with search
    expect(fetchMovies).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'Interstellar' }),
    );

    const tiles = await screen.findAllByTestId('movie-tile');
    expect(tiles).toHaveLength(1);
    within(tiles[0]).getByText('Interstellar');
  });

  it('updates URL when changing genre', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter('/', makeResp(MOVIES));
    await screen.findAllByTestId('movie-tile');

    // next response after genre switch
    (fetchMovies as jest.Mock).mockResolvedValueOnce(
      // Toy Story (Comedy)
      makeResp([MOVIES[2]]),
    );

    await user.click(screen.getByRole('button', { name: /comedy/i }));
    expect(router.state.location.search).toContain('genre=Comedy');
    expect(fetchMovies).toHaveBeenLastCalledWith(expect.objectContaining({ genre: 'Comedy' }));

    await screen.findByText('Toy Story');
    expect(screen.queryByText('Arrival')).not.toBeInTheDocument();
  });

  it('updates URL when changing sort', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter('/', makeResp(MOVIES));
    await screen.findAllByTestId('movie-tile');

    // next response for title sort (Arrival first)
    (fetchMovies as jest.Mock).mockResolvedValueOnce(makeResp([MOVIES[1], MOVIES[0], MOVIES[2]]));

    await user.selectOptions(screen.getByLabelText(/sort by/i), 'title');

    expect(router.state.location.search).toContain('sort=title');
    expect(fetchMovies).toHaveBeenLastCalledWith(expect.objectContaining({ sort: 'title' }));

    const firstTile = (await screen.findAllByTestId('movie-tile'))[0];
    within(firstTile).getByText(/arrival/i);
  });

  it('uses only the latest response (abort old)', async () => {
    const user = userEvent.setup();

    let resolve2!: (v: ApiResp) => void;

    // 1st call: returns a promise that REJECTS on abort
    (fetchMovies as jest.Mock).mockImplementationOnce(({ signal }) => {
      return new Promise<ApiResp>((_resolve, reject) => {
        const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
        signal.addEventListener('abort', onAbort, { once: true });
        // never resolve this one; it will be rejected by abort
      });
    });

    // 2nd call: the "latest" request we resolve to Arrival
    (fetchMovies as jest.Mock).mockImplementationOnce(() => {
      return new Promise<ApiResp>((resolve) => (resolve2 = resolve));
    });

    renderWithRouter('/');

    const input = screen.getByRole('searchbox', { name: /search query/i });
    await user.clear(input);
    await user.type(input, 'Arrival{enter}');

    // resolve latest response
    resolve2(
      makeResp([
        {
          id: 2,
          imageUrl: 'x',
          title: 'Arrival',
          year: 2016,
          genres: ['Sci-Fi'],
          rating: 0,
          duration: '',
          description: '',
        },
      ]),
    );

    await screen.findByText('Arrival');
    expect(screen.queryByText('Toy Story')).not.toBeInTheDocument();
  });
});
