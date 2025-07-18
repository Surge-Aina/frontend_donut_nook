// Admin-only: overview dashboard
import React from 'react';
import Layout from '../../components/Layout';
import MenuItems from '../../components/MenuItems';
import PageWrapper from '../../components/PageWrapper';

const Dashboard = () => (
  <Layout>
    <PageWrapper>
      <h1>Admin Dashboard</h1>
      {/* TODO: show stats, quick links */}
      <MenuItems/>
    </PageWrapper>
  </Layout>
);

export default Dashboard;
