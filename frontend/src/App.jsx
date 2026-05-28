import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { Sun, Moon, LogOut, Shield, GraduationCap, School, LogIn, Smartphone, Lock } from 'lucide-react';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Login inputs
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill credentials helper for instant evaluation
  const handlePreFill = (roleName) => {
    if (roleName === 'admin') {
      setMobileNumber('9999999999');
      setPassword('admin123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSubmitting(true);

    const result = await login(mobileNumber, password);
    setSubmitting(false);

    if (!result.success) {
      setLoginError(result.error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-muted)'
      }}>
        <h2>Loading session state...</h2>
      </div>
    );
  }

  // --- 1. RENDER AUTHENTICATION PAGE IF ANONYMOUS ---
  if (!user) {
    return (
      <div className="auth-page">
        <div className="card auth-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <School size={32} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
              EduNest
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sign in to manage schedules, roster billing, and attendance
            </p>
          </div>

          {loginError && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '500',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. 9999999999"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
              <Smartphone 
                size={16} 
                style={{ position: 'absolute', left: '1rem', bottom: '1rem', color: 'var(--text-muted)' }} 
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock 
                size={16} 
                style={{ position: 'absolute', left: '1rem', bottom: '1rem', color: 'var(--text-muted)' }} 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={submitting}
            >
              <LogIn size={18} /> {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Pre-fill Credentials for Testing */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.75rem', textAlign: 'center' }}>
              System Demo Logins
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} 
                  onClick={() => handlePreFill('admin')}
                >
                  <Shield size={12} style={{ marginRight: '0.25rem' }} /> Auto-fill System Admin
                </button>
              </div>
              <div style={{ 
                background: 'var(--bg-primary)', 
                borderRadius: '8px', 
                padding: '0.75rem', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                border: '1px dashed var(--border)',
                lineHeight: '1.4'
              }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>👨‍🏫 Seed Teacher:</strong> <code>8888888888</code> / <code>teacher123</code>
                </div>
                <div>
                  <strong>🎓 Seed Student:</strong> <code>7777777777</code> / <code>student123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. RENDER MAIN ECOSYSTEM LAYOUT IF LOGGED IN ---
  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <School size={22} />
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            EduNest
          </span>
        </div>

        {/* User Card inside Sidebar */}
        <div 
          style={{
            padding: '1.25rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: 'auto'
          }}
        >
          <span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'accent' : 'success'}`} style={{ marginBottom: '0.5rem' }}>
            {user.role}
          </span>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📞 {user.mobile_number}
          </p>
        </div>

        {/* Logout Control */}
        <button 
          className="btn btn-secondary" 
          onClick={logout}
          style={{ width: '100%', justifyContent: 'flex-start', marginTop: '1.5rem', borderColor: 'transparent', background: 'transparent' }}
        >
          <LogOut size={18} style={{ color: 'var(--danger)' }} /> 
          <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Logout Account</span>
        </button>
      </aside>

      {/* CORE FRAMEWORK INTERFACE */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
              {user.role === 'admin' && 'Ecosystem Operations Console'}
              {user.role === 'teacher' && 'Academic Operations Center'}
              {user.role === 'student' && 'My Learning Center Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{
                width: '42px',
                height: '42px',
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow)'
              }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <section className="content-pane">
          {user.role === 'admin' && <AdminDashboard />}
          {user.role === 'teacher' && <TeacherDashboard />}
          {user.role === 'student' && <StudentDashboard />}
        </section>
      </main>
    </div>
  );
}
