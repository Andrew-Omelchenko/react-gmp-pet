describe('Movie details route', () => {
  const listApi = /http:\/\/(localhost|127\.0\.0\.1):4000\/movies(?:\?.*)?$/;
  const showApi = /http:\/\/(localhost|127\.0\.0\.1):4000\/movies\/\d+$/;

  const replyList = (items: any[]) => ({ data: items, total: items.length, offset: 0, limit: 30 });

  beforeEach(() => {
    // Intercept list requests and alias them based on query params
    cy.intercept({ method: 'GET', url: listApi, resourceType: /xhr|fetch/ }, (req) => {
      const u = new URL(req.url);
      const search    = (u.searchParams.get('search') || '').toLowerCase();
      const filter    = u.searchParams.get('filter');
      const sortBy    = u.searchParams.get('sortBy') || 'release_date';
      const sortOrder = u.searchParams.get('sortOrder') || 'desc';

      if (search) req.alias = 'movies:search';
      else if (filter) req.alias = 'movies:filter';
      else if (sortBy === 'title') req.alias = 'movies:sort';
      else req.alias = 'movies:init';

      // Minimal demo dataset used in all tests
      let items = [
        { id: 1, imageUrl: 'x', title: 'Interstellar', year: 2014, genres: ['Sci-Fi'] },
        { id: 2, imageUrl: 'x', title: 'Arrival', year: 2016, genres: ['Sci-Fi'] },
        { id: 3, imageUrl: 'x', title: 'Toy Story', year: 1995, genres: ['Comedy'] },
        { id: 5, imageUrl: 'x', title: 'The Matrix', year: 1999, genres: ['Crime', 'Sci-Fi'] },
      ];

      if (search) {
        items = items.filter((m) => m.title.toLowerCase().includes(search));
      }
      if (filter) {
        items = items.filter((m) => m.genres.includes(filter));
      }
      if (sortBy === 'title') {
        items = items.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'release_date') {
        items = items.sort((a, b) => (sortOrder === 'asc' ? a.year - b.year : b.year - a.year));
      }

      req.reply(replyList(items));
    });

    // Intercept movie details
    cy.intercept({ method: 'GET', url: showApi, resourceType: /xhr|fetch/ }, (req) => {
      const id = req.url.match(/\/movies\/(\d+)$/)![1];
      const map: Record<string, any> = {
        '1': {
          id: 1, title: 'Interstellar', release_date: '2014-11-07',
          poster_path: 'x', overview: 'A team of explorers...', vote_average: 8.6, runtime: 169,
        },
        '2': {
          id: 2, title: 'Arrival', release_date: '2016-11-11',
          poster_path: 'x', overview: 'A linguist works...', vote_average: 7.9, runtime: 116,
        },
        '3': {
          id: 3, title: 'Toy Story', release_date: '1995-11-22',
          poster_path: 'x', overview: 'Toys come to life...', vote_average: 8.3, runtime: 81,
        },
        '5': {
          id: 5, title: 'The Matrix', release_date: '1999-03-31',
          poster_path: 'x', overview: 'A hacker learns...', vote_average: 8.7, runtime: 136,
        },
      };
      req.alias = 'movie:show';
      req.reply(map[id] ?? { id, title: `Movie ${id}`, poster_path: 'x', release_date: '2000-01-01', runtime: 90 });
    });
  });

  it('navigates to /:movieId when clicking a tile and preserves current search params', () => {
    cy.visit('/?genre=Comedy&sort=title');
    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');

    // With genre present, the first list call is aliased as movies:filter
    cy.wait('@movies:filter');

    cy.findByText('Toy Story', { timeout: 10000 }).should('exist');
    cy.findByText('Toy Story').closest('[data-testid="movie-tile"]').click();

    // details request fires
    cy.wait('@movie:show');

    // URL path + query preserved
    cy.location('pathname').should('eq', '/3');
    cy.location('search').should('contain', 'genre=Comedy');
    cy.location('search').should('contain', 'sort=title');

    // Header switched to details (SearchForm no longer visible)
    cy.findByRole('searchbox', { name: /search query/i }).should('not.exist');
    cy.findByRole('heading', { name: /toy story/i, level: 2 }).should('exist');
  });

  it('deep links to /:movieId and shows details after reload', () => {
    cy.visit('/5?query=Matrix&genre=Crime&sort=title');

    // Ensure the page shell mounted
    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');

    // On deep link we expect BOTH: details loader and the list request
    cy.wait('@movie:show');
    cy.wait('@movies:search');

    // Give React a micro-tick to commit after network settles
    cy.then(() => null);

    // Assert details header is visible (use generous timeout)
    cy.findByRole('heading', { name: /the matrix/i, level: 2, timeout: 10000 })
      .should('be.visible');

    // Grid should render at least one tile (the list is filtered by query+genre)
    cy.findAllByTestId('movie-tile', { timeout: 10000 })
      .should('have.length.at.least', 1);

    // Reload preserves route and params (and re-runs both requests)
    cy.reload();
    cy.wait('@movie:show');
    cy.wait('@movies:search');

    cy.location('pathname').should('eq', '/5');
    cy.location('search').should('contain', 'query=Matrix');

    cy.findByRole('heading', { name: /the matrix/i, level: 2, timeout: 10000 })
      .should('be.visible');
  });

});
