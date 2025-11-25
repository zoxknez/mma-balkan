const mockEvent = {
  id: 'event-1',
  name: 'SBC 45: Rakić vs Błachowicz',
  startAt: new Date('2025-12-15T19:00:00Z').toISOString(),
  status: 'SCHEDULED',
  city: 'Beograd',
  country: 'Srbija',
  mainEvent: 'Aleksandar Rakić vs Jan Błachowicz',
  ticketsAvailable: true,
  fightsCount: 12,
  attendees: 18000,
};

const mockEventsResponse = {
  success: true,
  data: [mockEvent],
  pagination: {
    page: 1,
    limit: 8,
    total: 16,
    totalPages: 2,
  },
};

const mockFightsResponse = {
  success: true,
  data: [
    {
      id: 'fight-1',
      eventId: mockEvent.id,
      section: 'MAIN',
      orderNo: 1,
      weightClass: 'LIGHT_HEAVYWEIGHT',
      status: 'SCHEDULED',
      redFighter: {
        id: 'fighter-1',
        name: 'Aleksandar Rakić',
      },
      blueFighter: {
        id: 'fighter-2',
        name: 'Jan Błachowicz',
      },
    },
  ],
};

const setupEventIntercepts = () => {
  cy.intercept('GET', '/api/events*', { statusCode: 200, body: mockEventsResponse }).as('getEvents');
  cy.intercept('GET', `/api/events/${mockEvent.id}`, { statusCode: 200, body: { success: true, data: mockEvent } }).as('getEventDetail');
  cy.intercept('GET', `/api/events/${mockEvent.id}/fights`, { statusCode: 200, body: mockFightsResponse }).as('getEventFights');
};

describe('Events Page', () => {
  beforeEach(() => {
    setupEventIntercepts();
    cy.visit('/events');
    cy.wait('@getEvents');
  });

  it('shows the event overview and cards', () => {
    cy.contains(/KALENDAR DOGAĐAJA/i).should('be.visible');
    cy.getByTestId('event-card').should('have.length', mockEventsResponse.data.length);
  });

  it('filters and sorts events via controls', () => {
    cy.getByTestId('filter-status').find('button').first().click();
    cy.contains('Nadolazeći').click();
    cy.url().should('include', 'status=upcoming');

    cy.getByTestId('sort-dropdown').find('button').first().click();
    cy.contains('Po nazivu').click();
    cy.url().should('include', 'sort=name');
  });

  it('handles pagination control clicks', () => {
    cy.getByTestId('pagination-next').click();
    cy.url().should('include', 'page=2');
    cy.getByTestId('pagination-prev').click();
    cy.url().should('not.include', 'page=2');
  });

  it('opens an event detail page from the grid', () => {
    cy.getByTestId('event-card').first().find('a[href^="/events/"]').first().click({ force: true });
    cy.url().should('include', `/events/${mockEvent.id}`);
    cy.wait(['@getEventDetail', '@getEventFights']);
    cy.getByTestId('event-name').should('contain.text', mockEvent.name);
  });
});

describe('Event Details Page', () => {
  beforeEach(() => {
    setupEventIntercepts();
    cy.visit(`/events/${mockEvent.id}`);
    cy.wait(['@getEventDetail', '@getEventFights']);
  });

  it('displays core event information', () => {
    cy.getByTestId('event-name').should('contain.text', mockEvent.name);
    cy.getByTestId('event-date').should('contain.text', '2025');
    cy.getByTestId('event-location').should('contain.text', mockEvent.city);
  });

  it('renders the fight card list', () => {
    cy.getByTestId('fight-card').within(() => {
      cy.contains(mockFightsResponse.data[0].redFighter.name);
      cy.contains(mockFightsResponse.data[0].blueFighter.name);
    });
  });

  it('allows exporting the event to a calendar file', () => {
    cy.getByTestId('add-to-calendar').click();
  });
});

