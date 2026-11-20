import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

export default function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    API.get(`/photos/${id}`)
      .then(({ data }) => {
        setPhoto(data.photo);
        setComments(data.comments);
      })
      .catch(() => setError('Photo not found'));
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError('');
    if (!commentText.trim()) return;
    try {
      const { data } = await API.post(`/photos/${id}/comments`, { comment: commentText });
      setComments([...comments, data]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  if (!photo) return <p className="empty-msg">{error || 'Loading photo details...'}</p>;

  return (
    <div className="detail-card">
      <Link to="/gallery" className="btn-secondary" style={{ display: 'inline-block', marginBottom: '1rem' }}>Back to Gallery</Link>
      <img src={`http://localhost:5000/uploads/${photo.fileName}`} alt={photo.title} className="detail-img" />
      <h2>{photo.title}</h2>
      <p className="photo-meta">
        Uploaded by <strong>{photo.userId?.firstName} {photo.userId?.lastName}</strong>
        {photo.userId?.occupation ? ` (${photo.userId.occupation})` : ''} • {new Date(photo.dateTime).toLocaleString()}
      </p>
      {photo.description && <p className="detail-desc">{photo.description}</p>}

      <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />
      <h3>Comments ({comments.length})</h3>
      {error && <p className="error">{error}</p>}

      {user ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Post</button>
        </form>
      ) : (
        <p className="photo-meta"><Link to="/login">Login</Link> to post a comment.</p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="photo-meta">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="comment-item">
              <div className="comment-header">
                <strong>{c.userId?.firstName} {c.userId?.lastName}</strong>
                <span>{new Date(c.dateTime).toLocaleString()}</span>
              </div>
              <p>{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
