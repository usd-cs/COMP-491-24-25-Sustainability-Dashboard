// cypress/e2e/ChartIntegration.cy.js

// don’t fail on uncaught exceptions in your app:
Cypress.on('uncaught:exception', () => false);

describe('MainPage Charts & Navigation', () => {
  beforeEach(() => {
    cy.visit('/main');
  });

  it('navigates to Bar Chart page', () => {
    cy.get('.visual-section').eq(0).click();
    cy.url().should('include', '/bar-chart');
    cy.get('.chart-container canvas').should('be.visible');
  });

  it('navigates to Bubble Chart page', () => {
    cy.get('.visual-section').eq(1).click();
    cy.url().should('include', '/bubble-chart');
    cy.get('.chart-container canvas').should('be.visible');
  });

  it('navigates to Pie Chart page', () => {
    cy.get('.visual-section').eq(2).click();
    cy.url().should('include', '/pie-chart');
    cy.get('.chart-container canvas').should('be.visible');
  });

  it('navigates to Tree Chart (Pictorial) page via the bottom wide section', () => {
    cy.get('.wide-visual-section').click();
    cy.url().should('include', '/line-chart');  // that's where your pictorial tree lives
    cy.get('select#periodSelect').should('exist'); 
  });
});

describe('BarChartWithAccordion E2E Tests', () => {
  beforeEach(() => {
    // Stub out the weekly data endpoint and visit the page
    cy.intercept('GET', '**/api/tables/getcombinedweekly').as('getWeekly');
    // Also intercept the daily data endpoint
    cy.intercept('GET', '**/api/tables/getcombinedweekly/daily**').as('getDaily');
    cy.visit('/bar-chart');
    cy.wait('@getWeekly');
  });

  it('shows "weekly" overview text in the "What This Chart Shows" accordion', () => {
    cy.contains('summary', 'What This Chart Shows').click();
    cy.get('.accordion-content')
      .should('contain.text', 'weekly total of electricity produced');
    // close it back up
    cy.contains('summary', 'What This Chart Shows').click();
  });

  it('toggles all accordion sections open and closed', () => {
    cy.get('.accordion details').each($detail => {
      cy.wrap($detail).find('summary').click();
      cy.wrap($detail).should('have.attr', 'open');
      cy.wrap($detail).find('summary').click();
      cy.wrap($detail).should('not.have.attr', 'open');
    });
  });
});

describe('Bubble Chart Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/getbubblechart').as('bubbleData');
    cy.visit('/bubble-chart');
    cy.wait('@bubbleData');
  });

  it('shows the scatter canvas and a “y =” trendline equation', () => {
    cy.get('.chart-container canvas').should('exist');
    cy.get('.trend-equation').should('contain.text', 'y =');
  });

  it('accordion toggles work here', () => {
    cy.get('.accordion details').first().as('detail');
    cy.get('@detail').find('summary').click();
    cy.get('@detail').should('have.attr', 'open');
    cy.get('@detail').find('summary').click();
    cy.get('@detail').should('not.have.attr', 'open');
  });
});

describe('Tree Chart (Pictorial) Page', () => {
  beforeEach(() => {
    // initial data fetch for default "1 year"
    cy.intercept('GET', '**/gettreedata?period=1%20year').as('initTree');
    cy.visit('/line-chart');
    cy.wait('@initTree');
  });

  it('defaults to “1 year” then updates to “6 months”', () => {
    cy.get('select#periodSelect').should('have.value', '1 year');

    cy.intercept('GET', '**/gettreedata?period=6%20months').as('sixMonthData');
    cy.get('select#periodSelect').select('6 months');
    cy.wait('@sixMonthData');
    cy.get('select#periodSelect').should('have.value', '6 months');
  });
});

describe('Pie Chart Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/energy/solar/contributions').as('pieData');
    cy.visit('/pie-chart');
    cy.wait('@pieData');
  });

  it('renders the pie canvas', () => {
    cy.get('.chart-container canvas').should('exist');
  });

  it('clicking the canvas (emphasis) still shows it', () => {
    cy.get('.chart-container canvas').click(150, 150).should('be.visible');
    cy.get('.chart-container canvas').click(150, 150).should('be.visible');
  });
});
