import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './AdminInterface.css';

const EMPTY_FORM = { title: '', location: '', price: '', beds: '', baths: '', area: '', description: '' };

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || null;
};

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
      images: editTarget?.images?.map(getImageUrl).filter(Boolean) || ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"],
      coords: editTarget?.coords || { lat: 17.4230, lng: 78.4210 },
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
    <div className="admin-editorial-view">
      <header className="premium-header">
        <div className="premium-header-left">
          <h1>Management</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> New Listing
        </button>
      </header>

      <div className="admin-container">
        <div className="admin-header-actions">
          <span className="subtitle">{apartments.length} properties in database</span>
        </div>

        <div className="editorial-table-wrapper">
          <table className="editorial-table">
            <thead>
              <tr>
                <th>Property Details</th>
                <th>Location</th>
                <th>Price</th>
                <th>Config</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map(apt => (
                <tr key={apt.id}>
                  <td>
                    <div className="property-preview-cell">
                      <img src={getImageUrl(apt.images?.[0]) || getImageUrl(apt.image)} alt={apt.title} />
                      <div className="preview-meta">
                        <span className="preview-title">{apt.title}</span>
                        <span className="preview-id">ID: {apt.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="table-text">{apt.location}</span></td>
                  <td><span className="table-text font-bold">&#8377;{Number(apt.price).toLocaleString()}</span></td>
                  <td><span className="table-text secondary">{apt.beds}B / {apt.baths}Ba</span></td>
                  <td><span className="status-tag">Published</span></td>
                  <td className="text-right">
                    <div className="table-actions">
                      <button className="icon-btn-clean" onClick={() => openEdit(apt)} title="Edit Profile">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-clean" onClick={() => handleDelete(apt)} title="Remove permanent">
                        <Trash2 size={16} className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apartments.length === 0 && (
            <div className="table-empty-state">
              <p>No listings found in the repository.</p>
              <button className="btn-secondary" onClick={openCreate}>Add First Property</button>
            </div>
          )}
        </div>
      </div>

      {modalMode && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <motion.div 
            className="editorial-admin-modal" 
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="modal-top">
              <div className="modal-title-group">
                <span className="modal-category">{modalMode === 'create' ? 'Draft' : 'Revision'}</span>
                <h2>{modalMode === 'create' ? 'New Asset' : 'Modify Asset'}</h2>
              </div>
              <button className="icon-btn-clean" onClick={closeModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="editorial-form">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Property Name</label>
                  <input required placeholder="e.g. Skyline Pavilion" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="form-group span-2">
                  <label>Geographic Location</label>
                  <input required placeholder="e.g. Banjara Hills, Hyderabad" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Monthly Rate (&#8377;)</label>
                  <input type="number" required min="0" placeholder="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Spatial Area (sqft)</label>
                  <input type="number" required min="0" placeholder="0" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input type="number" required min="0" placeholder="0" value={form.beds} onChange={e => setForm(p => ({ ...p, beds: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input type="number" required min="0" placeholder="0" value={form.baths} onChange={e => setForm(p => ({ ...p, baths: e.target.value }))} />
                </div>
                <div className="form-group span-2">
                  <label>Architectural Narrative</label>
                  <textarea rows={4} placeholder="Describe the spatial experience..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
              <div className="form-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Discard</button>
                <button type="submit" className="btn-primary">
                  {modalMode === 'create' ? 'Save to Collection' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
