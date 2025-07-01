// Responsive page wrapper: wrap all pages in <Layout>
import React from 'react';

const Layout = ({ children }) => (
  <div className="min-h-screen p-4 sm:p-8 lg:px-16">
    {/* Sticky header or nav can go here */}
    <main>{children}</main>
  </div>
);

export default Layout;

// DO NOT put API calls in this file
