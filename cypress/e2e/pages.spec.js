// cypress/e2e/pages.spec.js

const routes = [
    '/', '/home', '/menu', '/specials', '/about', '/store',
    '/customer', '/contact', '/test',
    '/login',
    '/manager/dashboard','/manager/menu','/manager/specials','/manager/customers','/manager/store',
    '/admin/dashboard','/admin/customers','/managers','/admin/store','/admin/about'
  ];
  
  describe('Site pages load successfully', () => {
    routes.forEach(route => {
      it(`loads ${route}`, () => {
        cy.visit(route);
        cy.get('h1').should('exist');
      });
    });
  });
  