import React from 'react';
import Layout from '../../components/Layout';
import StoreAdmin from '../../components/StoreAdmin';
import PageWrapper from '../../components/PageWrapper';

const Store = () => {
  return (
    <Layout>
      <PageWrapper>
        <StoreAdmin isReadOnly={true} />
      </PageWrapper>
    </Layout>
  );
};

export default Store;
