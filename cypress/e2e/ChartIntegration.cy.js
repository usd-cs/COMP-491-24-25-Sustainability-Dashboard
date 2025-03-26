
describe('MainPage Charts', () => {
    beforeEach(() => {
      cy.visit('/main'); // Navigate to MainPage
    });
  
    it('should display and click Bar Chart', () => {
      cy.get('.visual-section:nth-child(1)').should('be.visible').click();
    });
  
    it('should display and click Bubble Chart', () => {
      cy.get('.visual-section:nth-child(2)').should('be.visible').click();
      // Confirm data load, etc.
    });
  
    it('should fetch data from /api/tables/getenergy', () => {
      // Intercept the API call
      cy.intercept('GET', 'http://localhost:3000/api/tables/getenergy').as('barData');

      // Visit the page that triggers the axios call
      cy.visit('/bar-chart');

      // Wait for the request and check status
      cy.wait('@barData')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304]);
    });
  });