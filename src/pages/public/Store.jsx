import React from 'react';
import Layout from '../../components/Layout';
import StoreAdmin from '../../components/StoreAdmin';

const Store = () => {
  return (
    <Layout>
      <StoreAdmin isReadOnly={true} />
    </Layout>
  );
};

export default Store;
