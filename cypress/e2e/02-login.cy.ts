/// <reference types="cypress" />

describe('Login Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should load the login page successfully', () => {
    cy.contains('Log in bij Avans Keuze Compass').should('be.visible');
    cy.get('input[id="username"]').should('be.visible');
    cy.get('input[id="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Gebruikersnaam is verplicht').should('be.visible');
    cy.contains('Wachtwoord is verplicht').should('be.visible');
  });

  it('should show validation error for short password', () => {
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="password"]').type('short');
    cy.get('button[type="submit"]').click();
    cy.contains('Wachtwoord moet minimaal 8 tekens bevatten').should('be.visible');
  });


  it('should have a link to register page', () => {
    cy.contains('Nog geen account?').should('be.visible');
    cy.contains('Maak een account aan').click();
    cy.url().should('include', '/register');
  });

  it('should have a forgot password link', () => {
    cy.contains('Wachtwoord vergeten?').should('be.visible');
  });

  it('should attempt login with test credentials (may fail if backend not running)', () => {
    cy.get('input[id="username"]').type('Fabianopungol');
    cy.get('input[id="password"]').type('Fabianopungol123!');
    cy.get('button[type="submit"]').click();
    
    // Wait for either success or error message
    cy.get('button[type="submit"]', { timeout: 5000 })
      .should('not.be.disabled');
  });
});
