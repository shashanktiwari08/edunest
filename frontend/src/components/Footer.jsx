import React from 'react';
import { motion } from 'motion/react';
import { Music2, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64"
      style={{ border: 'none', position: 'relative', zIndex: 10 }}
    >
      {/* Top Grid: 12-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }} className="footer-top-grid">
        
        {/* First Column Group (5 cols) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }} className="col-span-12 md:col-span-5">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
              <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
            </svg>
            <span style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              LUMINA
            </span>
          </div>

          <p style={{
            fontSize: '13.5px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '380px',
            fontWeight: '400'
          }}>
            Lumina provides premium clarity on global events and cosmic wonders - shared with all for free.
          </p>
        </div>

        {/* Links Column Group (7 cols) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }} className="col-span-12 md:col-span-7 links-grid">
          
          {/* Column 1: Discover */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontSize: '11.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Discover
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Labs & Workshops', 'Deep Dive Series', 'Global Circle', 'Resource Vault', 'Future Roadmap'].map((item, idx) => (
                <a key={idx} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: The Mission */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontSize: '11.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              The Mission
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Origin Story', 'The Collective', 'Newsroom Hub', 'Join the Team'].map((item, idx) => (
                <a key={idx} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Concierge */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontSize: '11.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Get in Touch', 'Legal Privacy', 'User Agreement', 'Report Concern'].map((item, idx) => (
                <a key={idx} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }} className="footer-bottom-bar">
        
        {/* Left Side */}
        <p style={{
          fontSize: '9.5px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(255, 255, 255, 0.45)',
          fontWeight: '600'
        }}>
          Curated by @GotInGeorgiG
        </p>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontSize: '9.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.45)',
            fontWeight: '600'
          }}>
            Join the Journey:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {[
              { icon: <Music2 size={15} />, url: '#music' },
              { icon: <Facebook size={15} />, url: '#facebook' },
              { icon: <Twitter size={15} />, url: '#twitter' },
              { icon: <Youtube size={15} />, url: '#youtube' },
              { icon: <Instagram size={15} />, url: '#instagram' }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.url}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="social-icon-link"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .col-span-12 {
          grid-column: span 12 / span 12;
        }
        @media (min-width: 768px) {
          .footer-top-grid {
            gap: 3rem !important;
          }
          .col-span-12.md\\:col-span-5 {
            grid-column: span 5 / span 5 !important;
          }
          .col-span-12.md\\:col-span-7 {
            grid-column: span 7 / span 7 !important;
          }
        }
        @media (max-width: 767px) {
          .footer-top-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .links-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
        .footer-link {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
        }
        .footer-link:hover {
          color: #ffffff !important;
        }
        .social-icon-link:hover {
          color: #ef4d23 !important;
        }
      `}</style>
    </motion.footer>
  );
}
