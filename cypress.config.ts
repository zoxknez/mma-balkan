import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    
    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Environment
    env: {
      apiUrl: 'http://localhost:3003',
      coverage: false,
    },
    
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
      return _config;
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
