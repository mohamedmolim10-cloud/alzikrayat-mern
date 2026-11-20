import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Alzikrayat</Link>
      <div className="nav-links">
        <Link to="/" className="btn-link">Home</Link>
        <Link to="/gallery" className="btn-link">Gallery</Link>
        {user ? (
          <>
            <span className="welcome">Hi {user.firstName}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Please Login</Link>
        )}
      </div>
    </nav>
  );
}
