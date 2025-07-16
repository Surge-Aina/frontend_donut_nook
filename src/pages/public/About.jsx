import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/PageWrapper';

const About = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`)
      .then(res => {
        if (res.data.content) {
          setContent(res.data.content);
        } else {
          setError('No about content found');
        }
      })
      .catch(err => {
        setError('Error loading About: ' + err.message);
      });
  }, []);

  return (
    <Layout>
      <PageWrapper>
        <h1>About Donut Nook</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ReactMarkdown>{content}</ReactMarkdown>
      </PageWrapper>
    </Layout>
  );
};

export default About;
