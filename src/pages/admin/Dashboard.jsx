// Admin-only: overview dashboard
import React from 'react';
import Layout from '../../components/Layout';
import MenuItems from '../../components/MenuItems';

const Dashboard = () => (
  <Layout>
    <h1>Admin Dashboard</h1>
    {/* TODO: show stats, quick links */}
    <MenuItems/>
  </Layout>
);

export default Dashboard;
