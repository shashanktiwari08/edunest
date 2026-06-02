import React from 'react';
import { Award, Compass, Heart, Shield } from 'lucide-react';

export default function AboutSection() {
  const cards = [
    {
      icon: <Shield size={20} />,
      title: 'Reliable Infrastructure',
      desc: 'Built on top of Supabase Postgres Cloud Databases, providing instant synchronization and enterprise-grade data security.'
    },
    {
      icon: <Compass size={20} />,
      title: 'Automated Operations',
      desc: 'Our cycle-automation engine handles repeating monthly tasks, billing audits, payouts, and notifications silently in the background.'
    },
    {
      icon: <Heart size={20} />,
      title: 'User-Centric Design',
      desc: 'Sleek, harmonious light and dark modes tailored perfectly with visual micro-animations to deliver a premium administrative user experience.'
    }
  ];

  return (
    <div id="about" style={{ padding: '4rem 1rem', width: '100%' }} className="scroll-animate about-root">
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Main Content Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          
          {/* Left Text Column */}
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '0.75rem', fontSize: '13px' }}>
              Our Philosophy
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 5.5vw, 40px)',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem'
            }}>
              Designed to help educators focus on what matters most
            </h2>
            <p style={{
              fontSize: 'clamp(13px, 2.5vw, 14.5px)',
              color: '#4b5563',
              lineHeight: 1.65,
              marginBottom: '1.25rem'
            }}>
              EduNest was born out of a simple challenge faced by modern educators: the administrative burden of running tuition classes. Coordinating lecture schedules, tracking student attendance, managing pending tuition fees, and processing teacher payroll can quickly become overwhelming.
            </p>
            <p style={{
              fontSize: 'clamp(13px, 2.5vw, 14.5px)',
              color: '#4b5563',
              lineHeight: 1.65
            }}>
              Our software automates these repeating manual operations. By providing beautiful, clean dashboards coupled with highly secured Supabase databases, we empower tuition business owners to run organized, efficient, and scaling educational enterprises.
            </p>
          </div>

          {/* Right Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cards.map((card, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
                  display: 'flex',
                  gap: '1.125rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ef4d23',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      <style>{`
        .about-root {
          padding: 4rem 1rem;
        }
        @media (max-width: 600px) {
          .about-root {
            padding: 2.5rem 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
}
