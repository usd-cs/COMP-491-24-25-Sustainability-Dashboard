describe('MainPage Charts', () => {
  beforeEach(() => {
    cy.visit('/main')
  })

  it('should display and click Bar Chart', () => {
    cy.get('.visual-section:nth-child(1)')
      .should('be.visible')
      .click()
  })

  it('should display and click Bubble Chart', () => {
    cy.get('.visual-section:nth-child(2)')
      .should('be.visible')
      .click()
  })

  it('should fetch data from /api/tables/getenergy', () => {
    cy.intercept('GET', 'http://localhost:3000/api/tables/getenergy').as('barData')
    cy.visit('/bar-chart')
    cy.wait('@barData')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])
  })
})