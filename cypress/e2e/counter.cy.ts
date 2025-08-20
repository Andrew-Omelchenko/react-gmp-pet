describe('Counter (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders initial value from props', () => {
    cy.findByRole('button', { name: '-' })
      .parent()
      .within(() => {
        cy.contains('span', '0').should('exist');
      });
  });

  it('decrements value on click', () => {
    cy.findByRole('button', { name: '-' }).click();
    cy.findByRole('button', { name: '-' })
      .parent()
      .within(() => {
        cy.contains('span', '-1').should('exist');
      });
  });

  it('increments value on click', () => {
    cy.findByRole('button', { name: '+' }).click();
    cy.findByRole('button', { name: '-' })
      .parent()
      .within(() => {
        cy.contains('span', '1').should('exist');
      });
  });
});
