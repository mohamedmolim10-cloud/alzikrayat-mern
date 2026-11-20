import { useState, useEffect } from 'react';
import API from '../api';
import PhotoCard from '../components/PhotoCard';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/photos');
      setPhotos(data);
    } catch (err) {
      setError('Failed to load gallery photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) return setError('Please select an image file');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await API.post('/photos', formData);
      setTitle('');
      setDescription('');
      setImage(null);
      e.target.reset();
      fetchPhotos();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await API.delete(`/photos/${id}`);
      setPhotos(photos.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      {user && (
        <div className="form-card">
          <h3>Add New Photo</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleUpload}>
            <input type="text" placeholder="Photo Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Caption or story (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
            <button type="submit" className="btn-primary">Upload Photo</button>
          </form>
        </div>
      )}

      <div className="gallery-header">
        <h2>Community Photo Gallery</h2>
        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'} onClick={() => setViewMode('grid')}>Grid View</button>
          <button className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'} onClick={() => setViewMode('list')}>List View</button>
        </div>
      </div>

      {loading ? (
        <p className="empty-msg">Loading photos...</p>
      ) : photos.length === 0 ? (
        <p className="empty-msg">No photos uploaded yet.</p>
      ) : (
        <div className={viewMode === 'grid' ? 'photos-grid' : 'photos-list'}>
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} currentUserId={user?.id} onDelete={handleDelete} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
