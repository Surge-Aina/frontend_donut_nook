import React from 'react';

export default function SpecialCardEdit({ special, onEdit, onDelete }) {
  const formatDate = d => new Date(d).toLocaleDateString();
  return (
    <div style={{
      background: '#fff',
      border: '2px solid #f59e0b',
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      boxShadow: '0 2px 12px rgba(251, 191, 36, 0.08)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {special.image && special.image.trim() && (
          <img src={special.image} alt="icon" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#f3f4f6' }} onError={e => { e.target.style.display = 'none'; }} />
        )}
        <div>
          <h2 style={{ margin: 0, color: '#b45309', fontWeight: 700, fontSize: 22 }}>{special.title}</h2>
          <div style={{ color: '#6b7280', fontSize: 15 }}>{special.message}</div>
        </div>
        {/* Only show status if present and not empty */}
        {special.status && special.status.trim() && (
          <span style={{ marginLeft: 'auto', fontWeight: 600, color: special.status === 'active' ? '#059669' : '#dc2626', background: '#f3f4f6', borderRadius: 8, padding: '4px 12px', fontSize: 13 }}>{special.status}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 6 }}>
        <span style={{ color: '#92400e', fontSize: 14 }}>
          <b>Valid:</b> {formatDate(special.startDate)} - {formatDate(special.endDate)}
        </span>
        {/* Only show tags if present and not empty */}
        {Array.isArray(special.tags) && special.tags.length > 0 && (
          <span style={{ display: 'flex', gap: 6 }}>
            {special.tags.map(tag => (
              <span key={tag} style={{ background: '#fef3c7', color: '#b45309', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>{tag}</span>
            ))}
          </span>
        )}
        {/* Only show itemIds if present and not empty */}
        {Array.isArray(special.itemIds) && special.itemIds.length > 0 && (
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            <b>Items:</b> {special.itemIds.join(', ')}
          </span>
        )}
        {/* Optionally show createdBy if present */}
        {special.createdBy && (
          <span style={{ color: '#a16207', fontSize: 13 }}>
            <b>Created By:</b> {typeof special.createdBy === 'string' ? special.createdBy : special.createdBy.name || special.createdBy._id}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
        <button onClick={() => onEdit(special)} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
        <button onClick={() => { if(window.confirm('Delete this special?')) onDelete(special); }} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
      </div>
    </div>
  );
} 