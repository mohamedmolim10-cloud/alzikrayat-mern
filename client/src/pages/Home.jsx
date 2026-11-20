import { Link } from 'react-router-dom';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="home-banner">
      <h1>Welcome to Alzikrayat</h1>
      <p>
        Preserve, organize, and share your favorite visual memories with friends and family.
        Explore the community gallery, upload your moments, and join the conversation.
      </p>
      <div className="banner-actions">
        <Link to="/gallery" className="btn-primary">Explore Gallery</Link>
        {!user && <Link to="/login" className="btn-secondary">Login / Register</Link>}
      </div>
    </div>
  );
}
