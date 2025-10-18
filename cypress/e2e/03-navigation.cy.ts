/// <reference types="cypress" />

describe('Navigation E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have a functional navbar', () => {
    // Check if navbar exists
    cy.get('nav').should('exist');
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.url().should('include', '/login');
    cy.contains('Log in bij Avans Keuze Compass').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.visit('/register');
    cy.url().should('include', '/register');
  });

  it('should navigate to modules page', () => {
    cy.visit('/modules');
    cy.url().should('include', '/modules');
  });

  it('should navigate to stories page', () => {
    cy.visit('/Stories');
    cy.url().should('include', '/Stories');
  });

  it('should navigate to favorites page', () => {
    cy.visit('/favorites');
    cy.url().should('include', '/favorites');
  });

  it('should navigate to privacy page', () => {
    cy.visit('/privacy');
    cy.url().should('include', '/privacy');
  });

  it('should have a footer on the homepage', () => {
    cy.visit('/');
    cy.get('footer').should('exist');
  });

  it('should be able to navigate back and forth', () => {
    cy.visit('/');
    cy.contains('Start gratis').first().click();
    cy.url().should('include', '/register');
    cy.go('back');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
