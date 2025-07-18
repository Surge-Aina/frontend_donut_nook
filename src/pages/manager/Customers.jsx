// Manager & Admin: assign loyalty points
import toast from '../../components/toastLogger';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageWrapper from '../../components/PageWrapper';
import { getCustomers, addLoyaltyPoint, subtractLoyaltyPoint, updateLoyaltyPoints } from '../../utils/api';

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

  const handleAddLoyalty = async (customerId) => {
    await addLoyaltyPoint(customerId);
    fetchCustomers();
  };
  const handleEditLoyalty = (customerId) => {
    const newPoints = prompt('Enter new loyalty points value:');
    if (newPoints === null) return;
    updateLoyaltyPoints(customerId, Number(newPoints)).then(fetchCustomers);
    toast.success('Loyalty point updated!');
    toast.success('Loyalty point updated!');
  };
  const handleSubtractLoyalty = async (customerId) => {
    await subtractLoyaltyPoint(customerId);
    fetchCustomers();
  };

  return (
    <Layout>
      <PageWrapper>
      <PageWrapper>
      <h1>Manager: Customers</h1>
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
                    <button className="loyalty-plus-btn" title="Add Loyalty Point" onClick={() => handleAddLoyalty(c._id)}>+</button>
                    <button className="loyalty-minus-btn" title="Subtract Loyalty Point" onClick={() => handleSubtractLoyalty(c._id)}>-</button>
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
                    <button className="edit-loyalty-btn" title="Edit Loyalty Points" onClick={() => handleEditLoyalty(c._id)}>
                      ✏️
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
      </PageWrapper>
    </Layout>
  );
};

export default Customers;
