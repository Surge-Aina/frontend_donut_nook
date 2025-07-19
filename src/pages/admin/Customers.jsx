// Admin-only: view/add/remove customers + loyalty control
import toast from '../../components/toastLogger';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCustomers, deleteCustomer, resetLoyaltyPoints } from '../../utils/api';
import PageWrapper from '../../components/PageWrapper';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper to fetch customers
  const fetchCustomers = () => {
    setLoading(true);
    getCustomers()
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch customers');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRemoveLoyalty = async (customerId) => {
    if (!window.confirm('Reset this customer\'s loyalty points to zero?')) return;
    await resetLoyaltyPoints(customerId);
    toast.success('Loyalty points reset successfully!');
    fetchCustomers();
  };
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    await deleteCustomer(customerId);
    toast.success('Customer deleted successfully!');
    fetchCustomers();
  };

  return (
    <Layout>
      <PageWrapper>
      <h1>Admin: Customers</h1>
      {loading ? <div>Loading...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Loyalty Points</th>
              <th>Purchase History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) ? (
              customers.length === 0 ? (
                <tr><td colSpan={6} style={{textAlign:'center'}}>No customers found.</td></tr>
              ) : customers.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.dob ? new Date(c.dob).toLocaleDateString() : '-'}</td>
                  <td>
                    {c.loyaltyPoints ?? '-'}
                    <button className="loyalty-minus-btn" title="Reset Loyalty Points to Zero" onClick={() => handleRemoveLoyalty(c._id)}>-</button>
                  </td>
                  <td>
                    <ul className="purchase-list">
                      {c.purchaseHistory && c.purchaseHistory.length > 0 ? (
                        c.purchaseHistory.map((purchase, idx) => (
                          <li key={idx}>
                            Item: {purchase.menuItemId}, Amount: {purchase.amount}, Date: {new Date(purchase.timestamp).toLocaleDateString()}
                          </li>
                        ))
                      ) : (
                        <li>No purchases</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button className="delete-customer-btn" title="Delete Customer" onClick={() => handleDeleteCustomer(c._id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} style={{textAlign:'center',color:'red'}}>Error loading customers.</td></tr>
            )}
          </tbody>
        </table>
      )}
      </PageWrapper>
    </Layout>
  );
};

export default Customers;
