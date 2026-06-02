import React, { useState } from 'react';
import { Menu, X, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';

export default function Navbar({ onOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);

  // Logo SVG
  const LogoIcon = () => (
    <svg viewBox="0 0 32 32" style={{ fill: '#ef4d23' }} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
      {/* 8 Circles at radius 10 around center (16, 16) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 8;
        const cx = 16 + 10 * Math.cos(angle);
        const cy = 16 + 10 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="3.5" />;
      })}
      {/* Center circle */}
      <circle cx="16" cy="16" r="3.5" />
    </svg>
  );

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '1rem',
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      width: '100%',
      zIndex: 100
    }} className="sm:pt-6 sm:px-4">
      
      <nav style={{
        backgroundColor: '#ffffff',
        borderRadius: '9999px',
        border: '1px solid #e5e5e5',
        padding: '8px 16px',
        width: '100%',
        maxWidth: '760px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        transition: 'all 0.3s'
      }}>
        
        {/* Logo and Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <LogoIcon />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '18px',
            color: '#111827',
            letterSpacing: '-0.02em'
          }}>
            EduNest
          </span>
        </div>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginLeft: '2rem',
          fontSize: '14px',
          fontWeight: '550',
          color: '#1f2937'
        }}>
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4d23' }}>
            Home <span style={{ width: '4px', height: '4px', backgroundColor: '#ef4d23', borderRadius: '50%' }} />
          </a>
          <a href="#features" style={{ color: '#4b5563' }}>Features</a>
          <a href="#about" style={{ color: '#4b5563' }}>About</a>
          <a href="#pricing" style={{ color: '#4b5563' }}>Pricing</a>
        </div>

        {/* Right cluster */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Action button */}
          <button 
            onClick={onOpenLogin}
            style={{
              backgroundColor: '#ef4d23',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
          >
            <span className="cta-label-desktop">Sign In</span>
            <span className="cta-label-mobile">Sign In</span>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChevronRight size={12} strokeWidth={3} />
            </div>
          </button>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="nav-mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1f2937',
              display: 'none',
              alignItems: 'center',
              padding: 0
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '8px',
            right: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            padding: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <a 
              href="#home" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px 12px', color: '#ef4d23', fontWeight: '600', fontSize: '14px', borderRadius: '8px', background: '#fef2f2' }}
            >
              Home
            </a>
            <a 
              href="#features" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px 12px', color: '#4b5563', fontWeight: '500', fontSize: '14px' }}
            >
              Features
            </a>
            <a 
              href="#about" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px 12px', color: '#4b5563', fontWeight: '500', fontSize: '14px' }}
            >
              About
            </a>
            <a 
              href="#pricing" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px 12px', color: '#4b5563', fontWeight: '500', fontSize: '14px' }}
            >
              Pricing
            </a>
            <button 
              onClick={() => {
                setIsOpen(false);
                onOpenLogin();
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9999px',
                backgroundColor: '#0b0f1a',
                color: '#ffffff',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Sign In / Login
            </button>
          </div>
        )}

      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-cart-btn {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
          .cta-label-desktop {
            display: none !important;
          }
          .cta-label-mobile {
            display: inline !important;
          }
        }
        @media (min-width: 769px) {
          .cta-label-desktop {
            display: inline !important;
          }
          .cta-label-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
