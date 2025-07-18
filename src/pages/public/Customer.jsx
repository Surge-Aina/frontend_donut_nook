// Public: contact form for marketing sign-up
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import PageWrapper from '../../components/PageWrapper';
import { createCustomer } from '../../utils/api';

const Customer = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone) errs.phone = 'Phone is required';
    if (!form.dob) errs.dob = 'Date of Birth is required';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setStatus('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await createCustomer(form);
      setStatus('Customer created successfully!');
      setForm({ name: '', email: '', phone: '', dob: '' });
    } catch (err) {
      setStatus('Error creating customer.');
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <h1>Contact & Sign-up</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div>
            <label>Name:</label><br />
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </div>
          <div>
            <label>Email:</label><br />
            <input name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
          </div>
          <div>
            <label>Phone:</label><br />
            <input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
          </div>
          <div>
            <label>Date of Birth:</label><br />
            <input name="dob" type="date" value={form.dob} onChange={handleChange} />
            {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}
          </div>
          <button type="submit" style={{ marginTop: 12 }}>Sign Up</button>
          {status && <div style={{ marginTop: 8, color: status.startsWith('Error') ? 'red' : 'green' }}>{status}</div>}
        </form>
      </PageWrapper>
    </Layout>
  );
};

export default Customer;
