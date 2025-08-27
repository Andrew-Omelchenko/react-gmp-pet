describe('Counter using ids (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders initial value from props', () => {
    cy.findByTestId('counter-value').should('have.text', '0');
  });

  it('decrements value on click', () => {
    cy.findByTestId('counter-decrement').click();
    cy.findByTestId('counter-value').should('have.text', '-1');
  });

  it('increments value on click', () => {
    cy.findByTestId('counter-increment').click();
    cy.findByTestId('counter-value').should('have.text', '1');
  });
});
