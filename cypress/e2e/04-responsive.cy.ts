/// <reference types="cypress" />

describe('Responsive Design E2E Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach((viewport) => {
    context(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
      });

      it(`should display homepage correctly on ${viewport.name}`, () => {
        cy.contains('Jouw richting').should('be.visible');
        cy.contains('jouw toekomst').should('be.visible');
      });

      it(`should have accessible buttons on ${viewport.name}`, () => {
        cy.contains('Start gratis').first().should('be.visible');
        cy.contains('Ontdek verhalen').should('be.visible');
      });

      it(`should display navigation elements on ${viewport.name}`, () => {
        // Check if key navigation elements are accessible
        cy.get('nav').should('exist');
      });

      it(`should load login page correctly on ${viewport.name}`, () => {
        cy.visit('/login');
        cy.get('input[id="username"]').should('be.visible');
        cy.get('input[id="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
      });
    });
  });

  it('should handle orientation changes gracefully', () => {
    cy.viewport(667, 375); // Landscape mobile
    cy.visit('/');
    cy.contains('Jouw richting').should('be.visible');
    
    cy.viewport(375, 667); // Portrait mobile
    cy.contains('Jouw richting').should('be.visible');
  });
});
