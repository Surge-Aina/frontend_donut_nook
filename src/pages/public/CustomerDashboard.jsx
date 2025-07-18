// Customer Dashboard: view loyalty points and purchase history
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCurrentCustomer } from '../../utils/api';
import PageWrapper from '../../components/PageWrapper';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentCustomer()
      .then(data => {
        setCustomer(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch customer data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading your dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error">Error: {error}</div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="error">No customer data found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageWrapper>
        <div className="customer-dashboard">
          <h1>Welcome, {customer.name}!</h1>
          
          <div className="dashboard-section">
            <h2>Your Loyalty Points</h2>
            <div className="loyalty-points">
              <span className="points-display">{customer.loyaltyPoints || 0} points</span>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Purchase History</h2>
            {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
              <div className="purchase-history">
                <table className="purchase-history-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.purchaseHistory.map((purchase, index) => (
                      <tr key={index} className="purchase-item-row">
                        <td>{purchase.menuItemId}</td>
                        <td>{purchase.amount}</td>
                        <td>{purchase.timestamp ? new Date(purchase.timestamp).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-purchases">No purchase history yet.</p>
            )}
          </div>

          <div className="dashboard-section">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Date of Birth:</strong> {customer.dob}</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default CustomerDashboard; 