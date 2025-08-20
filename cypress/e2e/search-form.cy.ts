describe('SearchForm (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
  });

  it('renders input with initial value from props', () => {
    cy.findByRole('searchbox', { name: /search query/i }).should('have.value', 'Matrix');
  });

  it('calls onSearch with typed value on button click', () => {
    cy.findByRole('searchbox', { name: /search query/i })
      .clear()
      .type('Interstellar');

    cy.findByRole('button', { name: /search/i }).click();

    cy.get('@consoleLog').should('have.been.calledWith', 'Search Query: Interstellar');
  });

  it('calls onSearch with typed value on Enter key', () => {
    cy.findByRole('searchbox', { name: /search query/i })
      .clear()
      .type('Arrival{enter}');

    cy.get('@consoleLog').should('have.been.calledWith', 'Search Query: Arrival');
  });
});
