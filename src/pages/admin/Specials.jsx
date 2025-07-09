// Admin: create/edit specials (same functionality as manager)
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { specialsAPI } from '../../utils/api';
import SpecialForm from '../../components/SpecialForm';
import SpecialCardEdit from '../../components/SpecialCardEdit';
import { getCookie } from '../../components/CookieManager';

const Specials = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

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

  const handleAdd = () => {
    setEditingSpecial(null);
    setShowForm(true);
  };

  const handleEdit = (special) => {
    setEditingSpecial(special);
    setShowForm(true);
  };

  const handleDelete = async (special) => {
    if (window.confirm('Are you sure you want to delete this special?')) {
      try {
        await specialsAPI.delete(special._id);
        fetchSpecials();
        setError(null);
      } catch (err) {
        setError('Failed to delete special: ' + err.message);
      }
    }
  };

  const handleFormSubmit = async (form) => {
    setFormLoading(true);
    try {
      const userId = getCookie('userId');
      const payload = {
        ...form,
        tags: Array.isArray(form.tags) ? form.tags : [],
        status: (form.status || '').toLowerCase(),
        itemIds: Array.isArray(form.itemIds) ? form.itemIds.map(Number) : [],
        startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
        endDate: form.endDate ? new Date(form.endDate).toISOString() : '',
        specialId: editingSpecial ? editingSpecial.specialId : Date.now(),
        createdBy: editingSpecial ? editingSpecial.createdBy : userId,
      };
      if (editingSpecial) {
        await specialsAPI.update(editingSpecial._id, payload);
      } else {
        await specialsAPI.create(payload);
      }
      setShowForm(false);
      setEditingSpecial(null);
      fetchSpecials();
      setError(null);
    } catch (err) {
      setError('Failed to save special: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSpecial(null);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ 
          color: '#8B4513', 
          textAlign: 'center', 
          marginBottom: '40px',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          🎯 Admin: Manage Specials
        </h1>

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

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={handleAdd}
            style={{
              background: showForm ? '#dc2626' : '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            {showForm ? '❌ Cancel' : '➕ Add New Special'}
          </button>
        </div>

        {showForm && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '40px',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h2 style={{ color: '#8B4513', marginBottom: '20px', textAlign: 'center' }}>
              {editingSpecial ? '✏️ Edit Special' : '➕ Create New Special'}
            </h2>
            <SpecialForm
              initialValues={editingSpecial || {}}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={formLoading}
            />
          </div>
        )}

        <div style={{ marginTop: 30 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading specials...
            </div>
          ) : specials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍩</div>
              <h3 style={{ color: '#8B4513', marginBottom: '10px' }}>No Specials Found</h3>
              <p>Create your first special offer to get started!</p>
            </div>
          ) : (
            specials.map(special => (
              <SpecialCardEdit
                key={special._id}
                special={special}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Specials; 