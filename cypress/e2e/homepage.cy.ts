describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders hero and featured sections', () => {
    cy.getByTestId('hero-section').should('contain.text', 'Pridruži se Balkanskoj MMA zajednici');
    cy.getByTestId('featured-fight').within(() => {
      cy.contains(/Istaknuti meč/i);
      cy.getByTestId('countdown-timer').should('be.visible');
    });
  });

  it('shows navigation links and footer content', () => {
    cy.getByTestId('navigation').should('be.visible');
    cy.get('[data-testid="nav-link"]').should('have.length.at.least', 5);
    cy.getByTestId('footer').within(() => {
      cy.getByTestId('footer-links').find('a').should('have.length.at.least', 3);
    });
  });

  it('lists stats, fighters, news, and activity widgets', () => {
    cy.getByTestId('stats-section').find('[data-testid="stat-card"]').should('have.length', 4);
    cy.getByTestId('trending-fighters').find('[data-testid="fighter-card"]').should('have.length.at.least', 3);
    cy.getByTestId('latest-news').find('[data-testid="news-card"]').should('have.length.at.least', 3);
    cy.getByTestId('live-activity').should('exist');
  });

  it('navigates to the community page via CTA', () => {
    cy.getByTestId('cta-button').click();
    cy.location('pathname').should('include', '/community');
  });

  it('toggles the mobile menu on small viewports', () => {
    cy.viewport(375, 667);
    cy.get('button[aria-label="Otvori meni"]').click();
    cy.getByTestId('mobile-menu').should('be.visible');
    cy.get('button[aria-label="Zatvori meni"]').click();
    cy.get('body').find('[data-testid="mobile-menu"]').should('not.exist');
  });
});
