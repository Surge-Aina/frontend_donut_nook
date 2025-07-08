import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const AdminAbout = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`)
      .then(res => setContent(res.data.content || ''))
      .catch(err => setError('Failed to load about content'));
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
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/about`, { content })
      .then(() => setSuccess('About updated successfully!'))
      .catch(() => setError('Failed to update about content'));
  };

  return (
    <Layout>
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
    </Layout>
  );
};

export default AdminAbout;
