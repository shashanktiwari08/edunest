import React from 'react';
import { motion } from 'motion/react';

// Component 1: LogoIcon (Using branding orange #ef4d23 to match the site)
function LogoIcon() {
  return (
    <div style={{
      width: '32px',
      height: '32px',
      backgroundColor: '#ef4d23',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20C4 20 4 14 10 10C16 6 20 4 20 4C20 4 18 8 14 14C10 20 4 20 4 20Z" fill="white" />
        <path d="M4 20L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Component 2: FooterCard
function FooterCard() {
  const socials = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-800"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, url: '#linkedin' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-800"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, url: '#instagram' }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '1152px', // 6xl = 1152px
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      boxSizing: 'border-box'
    }}>
      
      {/* Outer Gray Body */}
      <div style={{
        backgroundColor: '#E9EBEE',
        borderRadius: '48px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: '8px'
      }}>
        
        {/* Inner White Box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '40px',
          margin: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          boxSizing: 'border-box'
        }}>
          
          {/* Content Grid Space */}
          <div style={{
            padding: '3rem', // Default p-12
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '3rem',
            boxSizing: 'border-box'
          }} className="footer-content-grid">
            
            {/* Brand Info Column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }} className="brand-col-span">
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LogoIcon />
                <span style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                  fontFamily: 'var(--font-display)'
                }}>
                  eduNest
                </span>
              </div>

              <p style={{
                color: '#64748B',
                lineHeight: '1.625',
                fontSize: '16px',
                fontWeight: '400',
                maxWidth: '320px',
                margin: 0
              }}>
                Premium strategic solutions designed to elevate your tuition academy presence through advanced management.
              </p>

              {/* Socials Group */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {socials.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url}
                    style={{
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                      textDecoration: 'none'
                    }}
                    className="social-btn"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

            </div>

            {/* Product Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0
              }}>
                Product
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Features', 'Solutions', 'Pricing', 'Updates'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="footer-card-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Science Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0
              }}>
                Science
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Approach', 'Identity', 'Research', 'Metrics'].map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-card-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0
              }}>
                Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['About Us', 'Partners', 'Careers'].map((link) => (
                  <li key={link}>
                    <a href="#about" className="footer-card-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '15px',
          boxSizing: 'border-box'
        }} className="bottom-legal-bar">
          <p style={{ color: '#64748B', fontWeight: '500', margin: 0 }}>
            © 2026 EduNest. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            color: '#64748B',
            fontWeight: '500'
          }}>
            <a href="#" className="legal-link">Legal Center</a>
            <div style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1' }} />
            <a href="#" className="legal-link">User Agreement</a>
          </div>
        </div>

      </div>

      <style>{`
        .footer-card-link {
          font-size: 15px;
          font-weight: 500;
          color: #1E293B;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-card-link:hover {
          color: #ef4d23 !important;
        }
        .legal-link {
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }
        .legal-link:hover {
          color: #1E293B !important;
        }
        .social-btn:hover {
          background-color: #f8fafc !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
        }
        .social-btn:active {
          transform: scale(0.95);
        }
        @media (min-width: 1024px) {
          .brand-col-span {
            grid-column: span 2 / span 2 !important;
          }
          .footer-content-grid {
            grid-template-columns: repeat(5, 1fr) !important;
            padding: 3rem 4rem !important;
          }
        }
        @media (max-width: 768px) {
          .footer-content-grid {
            grid-template-columns: 1fr !important;
            padding: 2.25rem 2rem !important;
            gap: 2.5rem !important;
          }
          .bottom-legal-bar {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

// Component 3: GlassText
function GlassText() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      paddingTop: 0,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Invisible SVG filter setup */}
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" result="outer-shadow"/>
            <feComponentTransfer in="SourceAlpha" result="alpha">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
            <feOffset in="alpha" dx="0" dy="4" result="offset-white" />
            <feGaussianBlur in="offset-white" stdDeviation="4" result="blur-white" />
            <feComposite in="alpha" in2="blur-white" operator="out" result="inner-white-mask" />
            <feFlood floodColor="#ffffff" floodOpacity="0.25" result="white-fill" />
            <feComposite in="white-fill" in2="inner-white-mask" operator="in" result="inner-white-final" />
            <feGaussianBlur in="alpha" stdDeviation="6" result="blur-black" />
            <feComposite in="alpha" in2="blur-black" operator="out" result="inner-black-mask" />
            <feFlood floodColor="#000000" floodOpacity="0.25" result="black-fill" />
            <feComposite in="black-fill" in2="inner-black-mask" operator="in" result="inner-black-final" />
            <feMerge>
              <feMergeNode in="outer-shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="inner-white-final" />
              <feMergeNode in="inner-black-final" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Motion text backdrop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative' }}
      >
        <h1 
          className="select-none text-center"
          style={{
            fontSize: 'min(22vw, 320px)',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            lineHeight: '0.85',
            margin: 0,
            padding: '0 1rem',
            fontFamily: 'var(--font-display)',
            textTransform: 'lowercase',
            background: 'linear-gradient(135deg, #ef4d23 0%, #8b5cf6 50%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 15px 30px rgba(239, 77, 35, 0.18))'
          }}
        >
          edunest
        </h1>
      </motion.div>

    </div>
  );
}

// Final Default Export
export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      marginTop: '6rem',
      boxSizing: 'border-box'
    }}>
      <FooterCard />
      <GlassText />
    </footer>
  );
}
