import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { getCookie } from '../../components/CookieManager';
import PageWrapper from '../../components/PageWrapper';

const AdminAbout = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setContent(res.data.content || ''))
    .catch(() => setError('Failed to load about content'));
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
    setSuccess('');
    setError('');
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  
  const token = getCookie('token');  // Make sure this gets the right token


  if (!token) {
    setError('You must be logged in to update.');
    return;
  }

  axios.put(`${process.env.REACT_APP_API_BASE_URL}/about`, { content }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => setSuccess('About updated successfully!'))
  .catch(() => setError('Failed to update about content'));
};


  return (
    <Layout>
      <PageWrapper>
        <h1>Admin: Edit About</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            rows="10"
            cols="80"
            value={content}
            onChange={handleChange}
            placeholder="Edit about content here..."
          />
          <br />
          <button type="submit">Save</button>
        </form>
      </PageWrapper>
    </Layout>
  );
};

export default AdminAbout;