// Public: view-only menu
import React from 'react';
import Layout from '../../components/Layout';

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
        <div className="menu-item-container">
          <div className="menu-item-bottom">
            <p>Boston Creme</p>
            <p>beep boop beep</p>
          </div>
          </div>
        <div className="menu-item-container">
          <div className="menu-item-bottom">
          <p>Old-fashioned</p>
          <p>Dough, glaze - you know it</p>
        </div>
        </div>
        <div className="menu-item-container">
          <div className="menu-item-bottom">
            <p>Boston Creme</p>
            <p>deserves to be on the menu 2x</p>
          </div>
        </div>
        <div className="menu-item-container">
          <div className="menu-item-bottom">
            <p>Blueberry filled</p>
            <p>yum</p>
          </div>
        </div>
        <div className="menu-item-container">
          <div className="menu-item-bottom">
            <p>Boston Creme</p>
            <p>make it 3x</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default Menu;
