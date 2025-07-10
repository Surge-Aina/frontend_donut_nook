// Admin-only: view/add/remove customers + loyalty control
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCustomers } from '../../utils/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCustomers()
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch customers');
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1>Admin: Customers</h1>
      {loading ? <div>Loading...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
        <table border="1" cellPadding="8" style={{marginTop:16}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Loyalty Points</th>
              <th>Purchase History</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.dob}</td>
                <td>{c.loyaltyPoints ?? '-'}</td>
                <td>
                  {Array.isArray(c.purchaseHistory) && c.purchaseHistory.length > 0 ? (
                    <ul style={{margin:0,paddingLeft:16}}>
                      {c.purchaseHistory.map((p, j) => (
                        <li key={j}>{p}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};


export default Customers;
