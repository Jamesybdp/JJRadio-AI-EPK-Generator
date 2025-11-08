describe('EPK generation flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/generate-epk', {
      fixture: 'epk.json'
    }).as('generateEpk');
  });

  it('submits the form and displays the generated EPK', () => {
    cy.visit('/');

    cy.get('input[name="artist_name"]').type('Test Artist');
    cy.get('input[name="track_title"]').type('Test Track');
    cy.get('input[name="email"]').type('artist@example.com');
    cy.get('textarea[name="lyrics_text"]').type('These are the lyrics.');

    cy.contains('button', /Generate EPK/i).click();

    cy.wait('@generateEpk');

    cy.contains('A generated artist bio.').should('be.visible');
    cy.contains('A generated summary.').should('be.visible');
  });
});
