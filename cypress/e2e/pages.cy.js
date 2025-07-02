const BASE_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';

describe('Donut Nook Route Smoke Test', () => {
  const routes = [
    '/home',
    '/menu',
    '/specials',
    '/about',
    '/store',
    '/customer',
    '/contact',
    '/test',
    '/login',
    '/manager/dashboard',
    '/manager/menu',
    '/manager/specials',
    '/manager/customers',
    '/manager/store',
    '/admin/dashboard',
    '/admin/customers',
    '/admin/store',
    '/admin/about',
    '/managers'
  ];

  routes.forEach(route => {
    it(`✅ Should load ${route}`, () => {
      cy.visit(`${BASE_URL}${route}`);
      cy.url().should('include', route);
    });
  });
});
