import React, { useState } from 'react';

const defaultValues = {
  title: '',
  message: '',
  startDate: '',
  endDate: '',
  itemIds: [],
  status: 'active',
};

const statusOptions = [
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
];

// Hardcoded test menu item IDs for now
const testMenuItems = [
  { id: 101, name: 'Glazed Donut' },
  { id: 102, name: 'Chocolate Bar' },
  { id: 103, name: 'Apple Fritter' },
  { id: 104, name: 'Maple Twist' },
];

export default function SpecialForm({ initialValues = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleItemIdsChange = e => {
    const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
    setForm(f => ({ ...f, itemIds: selected }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Only submit fields the backend expects
    onSubmit({
      title: form.title,
      message: form.message,
      startDate: form.startDate,
      endDate: form.endDate,
      itemIds: Array.isArray(form.itemIds) ? form.itemIds : [],
      status: (form.status || '').toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
      <div>
        <label>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={3} />
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <label>Start Date *</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
        </div>
        <div style={{ flex: 1 }}>
          <label>End Date *</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label>Menu Items (itemIds)</label>
        <select
          name="itemIds"
          multiple
          value={form.itemIds}
          onChange={handleItemIdsChange}
          style={{ width: '100%', minHeight: 60 }}
        >
          {testMenuItems.map(item => (
            <option key={item.id} value={item.id}>{item.name} (ID: {item.id})</option>
          ))}
        </select>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple items.
        </div>
      </div>
      <div>
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange} required>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <button type="submit" disabled={loading} style={{ background: '#059669', color: 'white', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#374151', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 