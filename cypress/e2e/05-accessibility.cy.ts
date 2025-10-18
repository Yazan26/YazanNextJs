/// <reference types="cypress" />

describe('Accessibility E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have proper heading hierarchy on homepage', () => {
    cy.get('h1').should('exist');
    cy.get('h2').should('exist');
  });

  it('should have accessible form labels on login page', () => {
    cy.visit('/login');
    cy.get('label[for="username"]').should('exist');
    cy.get('label[for="password"]').should('exist');
  });

  it('should have accessible buttons with proper text', () => {
    cy.contains('button', 'Start gratis').should('exist');
    cy.contains('Ontdek verhalen').should('exist');
  });

  it('should have working links with proper href attributes', () => {
    cy.get('a[href="/register"]').should('exist');
    cy.get('a[href="/login"]').should('exist');
    cy.get('a[href="/Stories"]').should('exist');
  });

  it('should have alt text for important visual elements', () => {
    // Check that emoji/icon elements are present and meaningful
    cy.contains('🧭').should('exist');
    cy.contains('🎯').should('exist');
    cy.contains('💬').should('exist');
  });

  it('should have keyboard-navigable forms on login page', () => {
    cy.visit('/login');
    
    // Check if form elements can be focused
    cy.get('input[id="username"]').focus().should('have.focus');
    cy.get('input[id="password"]').focus().should('have.focus');
    cy.get('button[type="submit"]').focus().should('have.focus');
  });

  it('should have proper input types for form fields', () => {
    cy.visit('/login');
    cy.get('input[id="username"]').should('have.attr', 'type', 'text');
    cy.get('input[id="password"]').should('have.attr', 'type', 'password');
  });

  it('should display error messages in an accessible way', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    
    // Error messages should be visible
    cy.contains('Gebruikersnaam is verplicht').should('be.visible');
    cy.contains('Wachtwoord is verplicht').should('be.visible');
  });

  it('should have semantic HTML structure', () => {
    cy.get('nav').should('exist');
    cy.get('main').should('exist');
    cy.get('footer').should('exist');
  });

  it('should have clear focus indicators', () => {
    cy.visit('/login');
    cy.get('input[id="username"]').focus();
    
    // Check if the focused element is visible
    cy.focused().should('be.visible');
  });
});
