import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchMemories = async () => {
    try {
      const { data } = await API.get('/memories');
      setMemories(data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchMemories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    if (date) formData.append('date', date);
    if (image) formData.append('image', image);

    try {
      if (editingId) {
        await API.put(`/memories/${editingId}`, formData);
        setEditingId(null);
      } else {
        await API.post('/memories', formData);
      }
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setImage(null);
      e.target.reset();
      fetchMemories();
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء حفظ الذكرى');
    }
  };

  const handleEdit = (memory) => {
    setEditingId(memory._id);
    setTitle(memory.title);
    setDescription(memory.description);
    setLocation(memory.location || '');
    setDate(memory.date ? memory.date.split('T')[0] : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الذكرى؟')) return;
    try {
      await API.delete(`/memories/${id}`);
      fetchMemories();
    } catch (err) {
      alert('فشل حذف الذكرى');
    }
  };

  return (
    <div className="dashboard">
      <div className="form-card">
        <h3>{editingId ? 'تعديل الذكرى' : 'إضافة ذكرى جديدة'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="عنوان الذكرى"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="تفاصيل الذكرى..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="form-row">
            <input
              type="text"
              placeholder="المكان (اختياري)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'حفظ التعديلات' : 'نشر الذكرى'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                  setLocation('');
                  setDate('');
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="memories-grid">
        {memories.length === 0 ? (
          <p className="empty-msg">لا توجد ذكريات بعد. أضف أول ذكرى لك!</p>
        ) : (
          memories.map((m) => (
            <div key={m._id} className="memory-card">
              {m.image && (
                <img
                  src={`http://localhost:5000${m.image}`}
                  alt={m.title}
                  className="memory-img"
                />
              )}
              <div className="memory-body">
                <h4>{m.title}</h4>
                <p className="memory-meta">
                  📅 {new Date(m.date).toLocaleDateString('ar-EG')}
                  {m.location && ` | 📍 ${m.location}`}
                </p>
                <p className="memory-desc">{m.description}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(m)} className="btn-edit">تعديل</button>
                  <button onClick={() => handleDelete(m._id)} className="btn-delete">حذف</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
