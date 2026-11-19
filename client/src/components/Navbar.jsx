import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">📸 الذكريات | Alzikrayat</Link>
      <div className="nav-links">
        {token ? (
          <>
            <span className="welcome">مرحباً، {user?.username}</span>
            <Link to="/" className="btn-link">ذكرياتي</Link>
            <button onClick={handleLogout} className="btn-logout">تسجيل خروج</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-link">دخول</Link>
            <Link to="/register" className="btn-primary">حساب جديد</Link>
          </>
        )}
      </div>
    </nav>
  );
}
