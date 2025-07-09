// Public: view-only specials list
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { specialsAPI } from '../../utils/api';

const Specials = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch specials when the component mounts
  useEffect(() => {
    fetchSpecials();
  }, []);

  const fetchSpecials = async () => {
    try {
      setLoading(true);
      const data = await specialsAPI.getAll();
      setSpecials(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch specials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ 
          color: '#8B4513', 
          textAlign: 'center', 
          marginBottom: '40px',
          fontSize: '3rem',
          fontWeight: 'bold'
        }}>
          🎯 Current Specials
        </h1>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid #fcc',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            fontSize: '1.2rem'
          }}>
            <div style={{ marginBottom: '20px', fontSize: '2rem' }}>⏳</div>
            Loading our amazing specials...
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && specials.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            fontSize: '1.2rem'
          }}>
            <div style={{ marginBottom: '20px', fontSize: '3rem' }}>🍩</div>
            <h2 style={{ color: '#8B4513', marginBottom: '10px' }}>No Specials Available</h2>
            <p>Check back soon for amazing deals and offers!</p>
          </div>
        )}

        {/* Specials Grid */}
        {!loading && !error && specials.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            padding: '20px 0'
          }}>
            {specials.map((special) => (
              <div
                key={special._id}
                style={{
                  background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                  border: '3px solid #fb923c',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 8px 25px rgba(251, 146, 60, 0.2)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(251, 146, 60, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(251, 146, 60, 0.2)';
                }}
              >
                {/* Special Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#f97316',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                }}>
                  Special Offer
                </div>

                {/* Special Content */}
                <div style={{ marginTop: '10px' }}>
                  <h2 style={{ 
                    color: '#9a3412', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    lineHeight: '1.3'
                  }}>
                    {special.title}
                  </h2>
                  
                  <p style={{ 
                    color: '#374151', 
                    marginBottom: '20px', 
                    lineHeight: '1.7',
                    fontSize: '1.1rem'
                  }}>
                    {special.message}
                  </p>

                  {/* Price Display */}
                  {special.price && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#9a3412'
                      }}>
                        ${special.price}
                      </span>
                    </div>
                  )}

                  {/* Date Range */}
                  <div style={{ 
                    fontSize: '1rem', 
                    color: '#6b7280', 
                    borderTop: '2px solid rgba(251, 146, 60, 0.3)', 
                    paddingTop: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>📅</span>
                    <span>
                      <strong>Valid:</strong> {formatDate(special.startDate)} - {formatDate(special.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!loading && !error && specials.length > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '30px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '20px',
            border: '2px solid #f59e0b'
          }}>
            <h2 style={{ 
              color: '#92400e', 
              marginBottom: '15px',
              fontSize: '1.5rem'
            }}>
              🎉 Don't Miss Out!
            </h2>
            <p style={{ 
              color: '#78350f', 
              fontSize: '1.1rem',
              marginBottom: '20px'
            }}>
              Visit our store to take advantage of these amazing specials!
            </p>
            <button style={{
              background: '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)';
            }}>
              Visit Store
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Specials;
