describe('MovieListPage URL state', () => {
  // Match ONLY the real API (not Vite modules). Covers localhost and 127.0.0.1
  const api = /http:\/\/(localhost|127\.0\.0\.1):4000\/movies(?:\?.*)?$/;

  const reply = (items: any[]) => ({
    data: items,
    total: items.length,
    offset: 0,
    limit: 30,
  });

  beforeEach(() => {
    // One intercept for all tests; choose alias + response based on query params.
    cy.intercept(
      { method: 'GET', url: api, resourceType: /xhr|fetch/ },
      (req) => {
        const u = new URL(req.url);

        const search    = (u.searchParams.get('search') || '').toLowerCase();
        const filter    = u.searchParams.get('filter');
        const sortBy    = u.searchParams.get('sortBy') || 'release_date';
        const sortOrder = u.searchParams.get('sortOrder') || 'desc';

        // Distinct aliases so tests can wait for the intended request
        if (search) req.alias = 'movies:search';
        else if (filter) req.alias = 'movies:filter';
        else if (sortBy === 'title') req.alias = 'movies:sort';
        else req.alias = 'movies:init';

        // Demo dataset
        let items = [
          { id: 1, imageUrl: 'x', title: 'Interstellar', year: 2014, genres: ['Sci-Fi'] },
          { id: 2, imageUrl: 'x', title: 'Arrival',      year: 2016, genres: ['Sci-Fi'] },
          { id: 3, imageUrl: 'x', title: 'Toy Story',    year: 1995, genres: ['Comedy'] },
          { id: 5, imageUrl: 'x', title: 'The Matrix',   year: 1999, genres: ['Crime', 'Sci-Fi'] },
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
          items = items.sort((a, b) =>
            sortOrder === 'asc' ? a.year - b.year : b.year - a.year
          );
        }

        req.reply(reply(items));
      }
    );
  });

  it('updates URL when searching', () => {
    cy.visit('/');

    // Ensure shell mounted & initial request done
    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');
    cy.wait('@movies:init');

    cy.findByRole('searchbox', { name: /search query/i }).as('search');
    cy.get('@search').clear().type('Interstellar{enter}');

    cy.location('search').should('contain', 'query=Interstellar');

    // Wait for the search-triggered call (NOT the initial one)
    cy.wait('@movies:search')
      .its('request.url')
      .should('include', 'search=Interstellar');

    cy.findAllByTestId('movie-tile').should('have.length', 1);
    cy.findByText('Interstellar').should('exist');
  });

  it('updates URL when changing genre', () => {
    cy.visit('/');
    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');
    cy.wait('@movies:init');

    cy.findByRole('button', { name: /^comedy$/i }).click();

    cy.location('search').should('contain', 'genre=Comedy');

    cy.wait('@movies:filter')
      .its('request.url')
      .should('include', 'filter=Comedy');

    cy.findByText('Toy Story').should('exist');
    cy.findByText('Arrival').should('not.exist');
  });

  it('updates URL when changing sort', () => {
    cy.visit('/');
    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');
    cy.wait('@movies:init');

    cy.findByLabelText(/sort by/i).select('title');

    cy.location('search').should('contain', 'sort=title');

    cy.wait('@movies:sort')
      .its('request.url')
      .should('include', 'sortBy=title');

    cy.findAllByTestId('movie-tile').first().within(() => {
      cy.findByText(/arrival/i).should('exist'); // title-sorted: Arrival first
    });
  });

  it('hydrates state from URL on reload', () => {
    cy.visit('/?query=Matrix&genre=Crime&sort=title');

    cy.findByTestId('movie-list-page', { timeout: 10000 }).should('exist');

    // With ?query present, first request will be aliased as movies:search
    cy.wait('@movies:search')
      .its('request.url')
      .then((url) => {
        const u = new URL(url as string);
        expect(u.searchParams.get('search')).to.eq('Matrix');
        expect(u.searchParams.get('filter')).to.eq('Crime');
        expect(u.searchParams.get('sortBy')).to.eq('title');
      });

    cy.findByRole('searchbox', { name: /search query/i }).should('have.value', 'Matrix');
    cy.findByRole('button', { name: /^crime$/i }).should('have.attr', 'aria-current', 'true');
    cy.findByLabelText(/sort by/i).should('have.value', 'title');

    cy.findByText('The Matrix').should('exist');
  });
});
