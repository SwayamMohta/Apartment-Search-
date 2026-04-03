import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import './AdminInterface.css';

const EMPTY_FORM = { title: '', location: '', price: '', beds: '', baths: '', area: '', description: '' };

export default function AdminInterface({ apartments, onBack, onAddApartment, onUpdateApartment, onDeleteApartment }) {
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setModalMode('create');
  };

  const openEdit = (apt) => {
    setForm({ title: apt.title, location: apt.location, price: apt.price, beds: apt.beds, baths: apt.baths, area: apt.area, description: apt.description || '' });
    setEditTarget(apt);
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setEditTarget(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apt = {
      ...form,
      price: Number(form.price),
      beds: Number(form.beds),
      baths: Number(form.baths),
      area: Number(form.area),
      rating: editTarget?.rating || 4.5,
      images: editTarget?.images || ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"],
      coords: editTarget?.coords || [17.4230, 78.4210],
      amenities: editTarget?.amenities || [],
    };
    if (modalMode === 'create') {
      onAddApartment(apt);
    } else {
      onUpdateApartment({ ...editTarget, ...apt });
    }
    closeModal();
  };

  const handleDelete = (apt) => {
    if (window.confirm(`Delete "${apt.title}"? This cannot be undone.`)) {
      onDeleteApartment(apt.id);
    }
  };

  return (
    <div className="admin-container">
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Map</span>
          </button>
          <h1>Listings Management</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> New Listing
        </button>
      </header>

      <div className="admin-content">
        <div className="table-wrapper glass-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Beds / Baths</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map(apt => (
                <tr key={apt.id}>
                  <td>
                    <div className="property-cell">
                      <img src={apt.images?.[0] || apt.image} alt={apt.title} className="thumb" />
                      <span className="title-text">{apt.title}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{apt.location}</td>
                  <td className="font-semibold">₹{Number(apt.price).toLocaleString()}</td>
                  <td className="text-secondary">{apt.beds}B / {apt.baths}Ba</td>
                  <td><span className="status-badge active">Active</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn-clean text-secondary" onClick={() => openEdit(apt)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-clean danger" onClick={() => handleDelete(apt)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apartments.length === 0 && (
            <div className="admin-empty">No listings yet. Click "New Listing" to add one.</div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="admin-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'New Listing' : 'Edit Listing'}</h2>
              <button className="icon-btn-clean" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input className="form-input" required placeholder="e.g. Modern Studio" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input className="form-input" required placeholder="e.g. Banjara Hills, Hyderabad" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹/month) *</label>
                  <input className="form-input" type="number" required min="0" placeholder="3500" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Area (sqft) *</label>
                  <input className="form-input" type="number" required min="0" placeholder="1000" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <input className="form-input" type="number" required min="0" max="10" placeholder="2" value={form.beds} onChange={e => setForm(p => ({ ...p, beds: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Bathrooms *</label>
                  <input className="form-input" type="number" required min="0" max="10" placeholder="2" value={form.baths} onChange={e => setForm(p => ({ ...p, baths: e.target.value }))} />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe the property..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{modalMode === 'create' ? 'Create Listing' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
