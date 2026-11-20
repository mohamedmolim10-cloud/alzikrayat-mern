import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', location: '', occupation: '', description: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? formData
        : { email: formData.email, password: formData.password };
      const { data } = await API.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <div className="form-row">
              <input type="text" placeholder="First Name *" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              <input type="text" placeholder="Last Name *" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Location (optional)" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <input type="text" placeholder="Occupation (optional)" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
            </div>
            <input type="text" placeholder="Short Bio (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </>
        )}
        <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 chars) *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-secondary">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="btn-primary">{isRegister ? 'Register' : 'Sign In'}</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} className="link-btn">
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}
