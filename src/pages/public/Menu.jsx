// Public: view-only menu
import React from 'react';
import Layout from '../../components/Layout';
import MenuItems from '../../components/MenuItems';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/PageWrapper';


const Menu = () => (
  <Layout>
    <PageWrapper>
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
    </PageWrapper>
  </Layout>
);

export default Menu;
