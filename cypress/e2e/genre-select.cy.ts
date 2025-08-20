describe('GenreSelect (E2E)', () => {
  const GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'];

  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
  });

  it('renders all genres passed in props', () => {
    GENRES.forEach((g) => {
      cy.findByRole('button', { name: g }).should('exist');
    });
  });

  it('highlights the selected genre passed in props', () => {
    cy.findByRole('button', { name: 'All' }).should('have.attr', 'aria-current', 'true');

    cy.findByRole('button', { name: 'Comedy' }).should('not.have.attr', 'aria-current', 'true');
  });

  it('calls onSelect with correct genre on click and updates highlight', () => {
    cy.findByRole('button', { name: 'Comedy' }).click();

    cy.get('@consoleLog').should('have.been.calledWith', 'Selected Genre: Comedy');

    cy.findByRole('button', { name: 'Comedy' }).should('have.attr', 'aria-current', 'true');
    cy.findByRole('button', { name: 'All' }).should('not.have.attr', 'aria-current', 'true');
  });
});
