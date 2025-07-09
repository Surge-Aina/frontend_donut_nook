// Public: view-only menu
import React from 'react';
import Layout from '../../components/Layout';
import MenuItems from '../../components/MenuItems';

const Menu = () => (
  <Layout>
    <div className="menu-page-container">
      {/* Tabs bar */}
      <div className="menu-tabs">
        <div className="menu-tab active">All</div>
        <div className="menu-tab">Favorites</div>
        <div className="menu-tab">Specials</div>
      </div>
      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <MenuItems/>
      </div>
    </div>
  </Layout>
);

export default Menu;
