import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageWrapper from '../../components/PageWrapper';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100';

const Contact = () => {
  const [about, setAbout] = useState([]);
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [aboutRes, storeRes] = await Promise.all([
          axios.get(`${API_URL}/about`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/store-info`).catch(() => ({ data: null })),
        ]);
        setAbout(Array.isArray(aboutRes.data) ? aboutRes.data : []);
        setStore(storeRes.data?.data || storeRes.data || null);
      } catch (err) {
        setError('Unable to load contact details right now.');
      }
    };
    load();
  }, []);

  const address = store?.address;
  const addressLine = address
    ? [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ')
    : '';
  const phone = store?.contact?.phone;
  const email = store?.contact?.email;
  const contactAbout = about.find((section) => /contact/i.test(section.title));
  const socialAbout = about.find((section) => /social/i.test(section.title));
  const hoursAbout = about.find((section) => /hour/i.test(section.title));

  return (
    <Layout>
      <PageWrapper>
        <div className="contact-page">
          <h1>Contact Us</h1>
          <p className="contact-intro">
            Stop by The Donut Nook, give us a call, or follow along for the daily bake.
          </p>
          {error && <p className="contact-error">{error}</p>}

          <div className="contact-grid">
            <section className="contact-card">
              <h2>Visit</h2>
              {store?.storeName && <p className="contact-store-name">{store.storeName}</p>}
              {addressLine ? (
                <p>{addressLine}{address?.country ? `, ${address.country}` : ''}</p>
              ) : (
                <p>Address coming soon.</p>
              )}
            </section>

            <section className="contact-card">
              <h2>Call or write</h2>
              {phone && <p>Phone: {phone}</p>}
              {email && <p>Email: {email}</p>}
              {contactAbout?.content && (
                <p className="contact-copy">{contactAbout.content}</p>
              )}
              {!phone && !email && !contactAbout?.content && <p>Phone and email coming soon.</p>}
            </section>

            <section className="contact-card">
              <h2>Hours</h2>
              {hoursAbout?.content ? (
                <p className="contact-copy">{hoursAbout.content}</p>
              ) : (
                <p>See the Store Information page for this week&apos;s hours.</p>
              )}
            </section>

            <section className="contact-card">
              <h2>Social</h2>
              {socialAbout?.content ? (
                <p className="contact-copy">{socialAbout.content}</p>
              ) : (
                <p>Follow us for daily specials.</p>
              )}
            </section>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default Contact;
