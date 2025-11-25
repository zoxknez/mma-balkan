describe('API Integration', () => {
  const apiUrl = Cypress.env('apiUrl');

  describe('Fighters API', () => {
    it('should fetch fighters list', () => {
      cy.request(`${apiUrl}/api/fighters`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should handle pagination', () => {
      cy.request(`${apiUrl}/api/fighters?page=1&limit=5`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.pagination).to.deep.include({
          page: 1,
          limit: 5,
        });
      });
    });

    it('should filter by weightClass', () => {
      cy.request(`${apiUrl}/api/fighters?weightClass=LIGHTWEIGHT`).then((response) => {
        expect(response.status).to.eq(200);
        const fighters = response.body.data;
        if (fighters.length > 0) {
          expect(fighters[0].weightClass).to.eq('LIGHTWEIGHT');
        }
      });
    });

    it('should search fighters', () => {
      cy.request(`${apiUrl}/api/fighters?search=test`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should get trending fighters', () => {
      cy.request(`${apiUrl}/api/fighters/trending?limit=5`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.at.most(5);
      });
    });

    it('should handle invalid fighter ID', () => {
      cy.request({
        url: `${apiUrl}/api/fighters/invalid-id`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]);
      });
    });
  });

  describe('Events API', () => {
    it('should fetch events list', () => {
      cy.request(`${apiUrl}/api/events`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should get upcoming events', () => {
      cy.request(`${apiUrl}/api/events/upcoming`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should filter by status', () => {
      cy.request(`${apiUrl}/api/events?status=SCHEDULED`).then((response) => {
        expect(response.status).to.eq(200);
        const events = response.body.data;
        if (events.length > 0) {
          expect(events[0].status).to.eq('SCHEDULED');
        }
      });
    });
  });

  describe('News API', () => {
    it('should fetch news list', () => {
      cy.request(`${apiUrl}/api/news`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should filter by category', () => {
      cy.request(`${apiUrl}/api/news?category=NEWS`).then((response) => {
        expect(response.status).to.eq(200);
        const news = response.body.data;
        if (news.length > 0) {
          expect(news[0].category).to.be.a('string');
        }
      });
    });

    it('should get featured news', () => {
      cy.request(`${apiUrl}/api/news?featured=true`).then((response) => {
        expect(response.status).to.eq(200);
        const news = response.body.data;
        if (news.length > 0) {
          expect(news[0].featured).to.eq(true);
        }
      });
    });
  });

  describe('Clubs API', () => {
    it('should fetch clubs list', () => {
      cy.request(`${apiUrl}/api/clubs`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should search clubs', () => {
      cy.request(`${apiUrl}/api/clubs?search=Belgrade`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', () => {
      cy.request(`${apiUrl}/healthz`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'ok');
        expect(response.body).to.have.property('time');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', () => {
      let rateLimited = false;
      const attempts = 80;

      return cy.wrap(Array.from({ length: attempts })).each(() => {
        return cy.request({
          url: `${apiUrl}/api/fighters`,
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 429) {
            rateLimited = true;
          }
        });
      }).then(() => {
        expect(rateLimited).to.eq(true);
      });
    });
  });
});

