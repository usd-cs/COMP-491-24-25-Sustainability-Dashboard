/**
 * @file FileUpload.cy.js
 * @description
 * End-to-end (E2E) Cypress tests for the file import flow.
 * Covers source selection, navigation to upload page, file upload (CSV and Excel), and success page navigation.
 * Tests both Athena and Bloom data sources, as well as cancel navigation.
 */
describe('File Import Flow', () => {
    beforeEach(() => {
      cy.visit('/select');
      cy.clearLocalStorage();
    });

    it('Selects Athena source and navigates to upload page', () => {
      cy.contains('Athena').click();
  
      cy.contains('Athena')
        .parent()
        .find('svg circle')
        .should('have.attr', 'fill', '#003B70');
  
      cy.contains('Last updated:')
        .should('exist')
        .should('not.contain', 'N/A');
  
      cy.contains('Submit').click();
      cy.url().should('include', '/upload');
  
      cy.contains('Athena File Settings').should('exist');
      cy.contains('.file-format-info', 'CSV').should('exist');
    });

    it('Selects Bloom source and navigates to upload page', () => {
      cy.contains('Bloom').click();
  
      cy.contains('Bloom')
        .parent()
        .find('svg circle')
        .should('have.attr', 'fill', 'white');
  
      cy.contains('Submit').click();
      cy.url().should('include', '/upload');
  
      cy.contains('Bloom File Settings').should('exist');
      cy.contains('.file-format-info', 'Microsoft Excel').should('exist');
    });

    it('Cancel button redirects back to main page', () => {
      cy.contains('Cancel').click();
      cy.url().should('include', '/main');
    });

    it('Uploads Athena CSV file and clicks Import to go to upload-success page', () => {
        cy.contains('Athena').click();
        cy.contains('Submit').click();
        cy.url().should('include', '/upload');
      
        // Click the "Select files" label (which is associated with the input file)
        cy.get('label[for="fileInput"]').contains('Select files').click(); // Target the label for the file input
        
        // Upload the Athena CSV file
        cy.get('input[type="file"]').selectFile('cypress/fixtures/all_meters_monthly_by_hour.csv', { force: true });
      
        // Wait for the "Import" button to be visible and enabled
        cy.get('.import-btn').should('be.visible').and('not.be.disabled');
      
        // After file is selected, click Import to go to the upload-success page
        cy.get('.import-btn').click(); // Click on the Import button
        cy.url().should('include', '/upload-success');
      });

    it('Uploads Bloom Excel file and clicks Import to go to upload-success page', () => {
      cy.contains('Bloom').click();
      cy.contains('Submit').click();
      cy.url().should('include', '/upload');
  
      // Click the "Select files" label (which is associated with the input file)
      cy.get('label[for="fileInput"]').contains('Select files').click(); // Target the label for the file input
  
      // Upload the Bloom Excel file (University of San Diego - Data Extract - 30-Day.xlsx)
      cy.get('input[type="file"]').selectFile('cypress/fixtures/University of San Diego - Data Extract - 30-Day.xlsx', { force: true });
  
      // Wait for the "Import" button to be visible and enabled
      cy.get('.import-btn').should('be.visible').and('not.be.disabled');
  
      // After file is selected, click Import to go to the upload-success page
      cy.get('.import-btn').click(); // Click on the Import button
      cy.url().should('include', '/upload-success');
    });
});
