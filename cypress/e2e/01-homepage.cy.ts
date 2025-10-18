/// <reference types="cypress" />

describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    cy.contains('Jouw richting').should('be.visible');
    cy.contains('jouw toekomst').should('be.visible');
  });

  it('should display all main sections', () => {
    // Check hero section
    cy.contains('Start gratis').should('be.visible');
    cy.contains('Ontdek verhalen').should('be.visible');
    
    // Check stats section
    cy.contains('1000+').should('be.visible');
    cy.contains('Studenten geholpen').should('be.visible');
    
    // Check features
    cy.contains('Compass Check').should('be.visible');
    cy.contains('Programma Match').should('be.visible');
    cy.contains('Coach Connect').should('be.visible');
  });

  it('should navigate to register page when clicking "Start gratis"', () => {
    cy.contains('Start gratis').first().click();
    cy.url().should('include', '/register');
  });

  it('should navigate to stories page when clicking "Ontdek verhalen"', () => {
    cy.contains('Ontdek verhalen').click();
    cy.url().should('include', '/Stories');
  });

  it('should display the process steps (Verken, Vergelijk, Verbind)', () => {
    cy.contains('Stap 1').should('be.visible');
    cy.contains('Verken').should('be.visible');
    cy.contains('Stap 2').should('be.visible');
    cy.contains('Vergelijk').should('be.visible');
    cy.contains('Stap 3').should('be.visible');
    cy.contains('Verbind').should('be.visible');
  });

  it('should display testimonials section', () => {
    cy.contains('Wat studenten zeggen').should('be.visible');
    cy.contains('Mila').should('be.visible');
    cy.contains('Dani').should('be.visible');
  });

  it('should have working CTA buttons in the final section', () => {
    cy.contains('Klaar voor jouw volgende stap?').should('be.visible');
    cy.contains('Nu starten').should('be.visible').click();
    cy.url().should('include', '/register');
  });
});
