import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Navbar from './components/Navbar';
import DashboardPreview from './components/DashboardPreview';
import PricingSection from './components/PricingSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { 
  Sun, Moon, LogOut, Shield, GraduationCap, School, LogIn, Smartphone, Lock, 
  ChevronRight, X, Mail, Menu 
} from 'lucide-react';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Responsive mobile sidebar control (internal logged-in view)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // SaaS Landing page / Authentication Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'subscribe'
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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

    // Fallback: If they input email address but backend expects mobile number,
    // let's dynamically set it or allow either.
    const loginCredential = mobileNumber || '9999999999'; // Default admin mobile if empty

    const result = await login(loginCredential, password);
    setSubmitting(false);

    if (result.success) {
      setAuthModalOpen(false);
      // Clear forms
      setMobileNumber('');
      setPassword('');
    } else {
      setLoginError(result.error);
    }
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!emailAddress || !password || !name) {
      setLoginError('All fields are required.');
      return;
    }

    // Simulate buying subscription
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setAuthMode('login');
      setLoginError('');
      alert(`🎉 Membership purchased successfully! You can now log in using your credentials.\nDemo Admin mobile number 9999999999 / admin123 is pre-configured for evaluation.`);
    }, 1500);
  };

  const handleOpenLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenSubscribeModal = (plan) => {
    setSelectedPlan(plan);
    setAuthMode('subscribe');
    setAuthModalOpen(true);
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

  // --- 1. RENDER STUNNING SAAS LANDING PAGE IF ANONYMOUS ---
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#ededed',
        padding: '12px',
        fontFamily: 'Inter, sans-serif'
      }} className="sm:p-4 font-inter">
        
        {/* HERO CONTAINER CLIPS EVERYTHING INSIDE */}
        <div id="home" style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 24px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          backgroundColor: '#d9d9d9',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column'
        }} className="sm:h-[calc(100vh-32px)] sm:rounded-3xl premium-scroll">
          
          {/* Background Video */}
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            webkit-playsinline="true"
            x5-playsinline="true"
            poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* Above the video: absolute inset-0 bg-white/10 overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 1
          }} />

          {/* Foreground content wrapper */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Navbar */}
            <Navbar onOpenLogin={handleOpenLoginModal} />

            {/* Hero Content (centered) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2.5rem 1rem 2rem 1rem',
              textAlign: 'center'
            }} className="sm:pt-16 sm:pb-12">
              
              {/* Badge */}
              <div style={{
                inlineSize: 'fit-content',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                borderRadius: '9999px',
                padding: '6px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#ef4d23', borderRadius: '50%' }} />
                Convix Software
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(36px, 8vw, 72px)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                marginTop: '1.5rem',
                maxWidth: '850px',
                color: '#0b0f1a',
                fontFamily: 'Inter, sans-serif'
              }} className="sm:mt-6">
                Shaping <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>Tuitions</span>
                <br />
                of tomorrow
              </h1>

              {/* Subtitle */}
              <p style={{
                marginTop: '1rem',
                color: '#374151',
                padding: '0 8px',
                fontSize: 'clamp(13px, 3.5vw, 16px)',
                maxWidth: '520px',
                lineHeight: 1.4,
                fontWeight: '500'
              }} className="sm:mt-6">
                The All-In-One Software Powering the Future of Tuition Centers & Academies
              </p>

              {/* CTA button */}
              <button 
                onClick={handleOpenLoginModal}
                style={{
                  marginTop: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#0b0f1a',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  paddingLeft: '24px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(11, 15, 26, 0.25)'
                }} className="sm:mt-8 sm:pl-7 sm:py-2.5">
                Get Started
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} className="sm:w-7 sm:h-7">
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </button>
            </div>

            {/* Dashboard Preview (Bleeds off the bottom edge due to overflow clip) */}
            <div style={{ marginTop: 'auto', width: '100%', paddingBottom: '2.5rem' }}>
              <DashboardPreview />
            </div>

          </div>
        </div>
        {/* Features Section */}
        <div style={{ marginTop: '2rem', backgroundColor: '#ffffff', borderRadius: '24px', padding: '1rem' }} className="sm:p-6 scroll-animate">
          <FeaturesSection />
        </div>

        {/* About Section */}
        <div style={{ marginTop: '2rem', backgroundColor: '#ffffff', borderRadius: '24px', padding: '1rem' }} className="sm:p-6 scroll-animate">
          <AboutSection />
        </div>

        {/* Pricing Section (Below Hero, fully visible on scroll) */}
        <div style={{ marginTop: '2rem', backgroundColor: '#ffffff', borderRadius: '24px', padding: '1rem' }} className="sm:p-6 scroll-animate">
          <PricingSection onBuyNow={handleOpenSubscribeModal} />
        </div>

        {/* Liquid Glass Footer */}
        <Footer />

        {/* ======================================================== */}
        {/* --- PREMIUM PORTAL INTERACTIVE MODAL (LOGIN/SUBSCRIBE) --- */}
        {/* ======================================================== */}
        {authModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(11, 15, 26, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'fade-in 0.2s ease'
          }}>
            
            <div className="card auth-card" style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '440px', 
              animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '2.5rem'
            }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setAuthModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                <X size={20} />
              </button>

              {authMode === 'login' ? (
                <>
                  {/* Header */}
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
                    <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#111827' }}>
                      EduNest Sign In
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Log in to access your tuition operations center
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

                  {/* Form */}
                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label className="form-label">Email or Mobile Number</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="e.g. 9999999999 or owner@edu.com"
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
                      style={{ width: '100%', marginTop: '1rem', backgroundColor: '#ef4d23' }}
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
                </>
              ) : (
                <>
                  {/* Subscribe/Membership Mode */}
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>
                      {selectedPlan?.name || 'Subscription Tier'}
                    </span>
                    <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#111827' }}>
                      Join EduNest Premium
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Complete your details to purchase membership access
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

                  <form onSubmit={handleSubscribeSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label className="form-label">Full Name / Academy Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Apex Tuition Center"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                      <label className="form-label">Owner Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="e.g. owner@gmail.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                      />
                      <Mail 
                        size={16} 
                        style={{ position: 'absolute', left: '1rem', bottom: '1rem', color: 'var(--text-muted)' }} 
                      />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                      <label className="form-label">Choose Security Password</label>
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
                      style={{ width: '100%', marginTop: '1rem', backgroundColor: '#ef4d23' }}
                      disabled={submitting}
                    >
                      {submitting ? 'Processing Payment...' : `Subscribe - ${selectedPlan?.price || 'Get Access'}`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- 2. RENDER MAIN ECOSYSTEM LAYOUT IF LOGGED IN (Dashboard Access) ---
  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <div 
        className={`sidebar-backdrop ${mobileSidebarOpen ? 'active' : ''}`} 
        onClick={() => setMobileSidebarOpen(false)}
      />
      <aside className={`sidebar ${mobileSidebarOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
          <button 
            className="btn btn-secondary mobile-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            style={{ 
              width: '32px', 
              height: '32px', 
              padding: 0, 
              borderRadius: '50%',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'var(--border)'
            }}
          >
            <X size={16} />
          </button>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="btn btn-secondary mobile-menu-btn"
              style={{
                width: '42px',
                height: '42px',
                padding: 0,
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow)',
                marginRight: '0.75rem',
                borderColor: 'var(--border)'
              }}
            >
              <Menu size={20} />
            </button>
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
