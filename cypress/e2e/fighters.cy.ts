const mockFightersResponse = {
  success: true,
  data: [
    {
      id: 'fighter-1',
      name: 'Miloš Terzić',
      nickname: 'Thunder',
      country: 'Srbija',
      countryCode: 'RS',
      weightClass: 'LIGHTWEIGHT',
      stance: 'ORTHODOX',
      wins: 10,
      losses: 2,
      draws: 0,
      koTkoWins: 4,
      submissionWins: 3,
      decisionWins: 3,
      ranking: { position: 1, organization: 'SBC' },
      isActive: true,
      club: { name: 'Belgrade MMA' },
    },
    {
      id: 'fighter-2',
      name: 'Ana Bajić',
      country: 'Srbija',
      countryCode: 'RS',
      weightClass: 'BANTAMWEIGHT',
      stance: 'SOUTHPAW',
      wins: 15,
      losses: 1,
      draws: 0,
      koTkoWins: 6,
      submissionWins: 5,
      decisionWins: 4,
      ranking: { position: 2, organization: 'SBC' },
      isActive: true,
      club: { name: 'Novi Sad Fight Club' },
    },
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 2,
    totalPages: 1,
  },
};

const setupFighterIntercepts = () => {
  cy.intercept('GET', '/api/fighters*', { statusCode: 200, body: mockFightersResponse }).as('getFighters');
};

describe('Fighters Page', () => {
  beforeEach(() => {
    setupFighterIntercepts();
    cy.visit('/fighters');
    cy.wait('@getFighters');
  });

  it('renders the fighters hero and cards', () => {
    cy.contains(/BALKAN WARRIORS DATABASE/i).should('be.visible');
    cy.getByTestId('fighter-card').should('have.length', mockFightersResponse.data.length);
  });

  it('filters fighters via the search input', () => {
    cy.getByTestId('fighters-search').type('Ana');
    cy.wait(400);
    cy.getByTestId('fighter-card').should('have.length', 1).first().should('contain.text', 'Ana Bajić');
  });

  it('filters fighters by weight class', () => {
    cy.getByTestId('weight-filter').select('BANTAMWEIGHT');
    cy.wait(100);
    cy.getByTestId('fighter-card').should('have.length', 1).first().should('contain.text', 'Ana Bajić');
  });

  it('sorts fighters by wins', () => {
    cy.getByTestId('sort-filter').select('wins');
    cy.wait(100);
    cy.getByTestId('fighter-card').first().should('contain.text', 'Ana Bajić');
  });

  it('shows fighter metadata inside the card', () => {
    cy.getByTestId('fighter-card').first().within(() => {
      cy.contains('Srbija');
      cy.contains('Belgrade MMA');
      cy.contains(/Aktivan/i);
    });
  });
});
