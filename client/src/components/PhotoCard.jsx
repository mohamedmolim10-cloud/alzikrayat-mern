import { Link } from 'react-router-dom';

export default function PhotoCard({ photo, currentUserId, onDelete, viewMode }) {
  const ownerId = photo.userId?._id || photo.userId;
  const isOwner = currentUserId && ownerId === currentUserId;

  return (
    <div className={viewMode === 'list' ? 'photo-card list-item' : 'photo-card'}>
      <Link to={`/photos/${photo._id}`}>
        <img
          src={`http://localhost:5000/uploads/${photo.fileName}`}
          alt={photo.title}
          className="photo-img"
        />
      </Link>
      <div className="photo-body">
        <h4><Link to={`/photos/${photo._id}`} className="photo-title-link">{photo.title}</Link></h4>
        <p className="photo-meta">
          By {photo.userId?.firstName} {photo.userId?.lastName} • {new Date(photo.dateTime).toLocaleDateString()}
        </p>
        {photo.description && <p className="photo-desc">{photo.description}</p>}
        <div className="card-actions">
          <Link to={`/photos/${photo._id}`} className="btn-view">View & Comment</Link>
          {isOwner && (
            <button onClick={() => onDelete(photo._id)} className="btn-delete">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
