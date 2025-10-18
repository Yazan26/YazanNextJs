/// <reference types="cypress" />

// Define custom types for your application
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TestAccount {
  username: string;
  password: string;
  role: 'admin' | 'student';
}

// Test data
export const TEST_ACCOUNTS: TestAccount[] = [
  {
    username: 'Fabianopungol',
    password: 'Fabianopungol123!',
    role: 'student',
  },
  {
    username: 'Admin',
    password: 'Admin@Admin.com',
    role: 'admin',
  },
];

// Selectors for commonly used elements
export const SELECTORS = {
  login: {
    usernameInput: 'input[id="username"]',
    passwordInput: 'input[id="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '[class*="text-red"]',
  },
  navigation: {
    navbar: 'nav',
    footer: 'footer',
  },
  homepage: {
    heroTitle: 'Jouw richting',
    startButton: 'Start gratis',
    storiesButton: 'Ontdek verhalen',
  },
} as const;

// Helper functions for common test operations
export const waitForPageLoad = () => {
  cy.url().should('not.include', 'undefined');
  cy.get('body').should('be.visible');
};

export const clearLocalStorage = () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
};

export const getLocalStorageItem = (key: string) => {
  return cy.window().its('localStorage').invoke('getItem', key);
};

export const setLocalStorageItem = (key: string, value: string) => {
  cy.window().its('localStorage').invoke('setItem', key, value);
};
