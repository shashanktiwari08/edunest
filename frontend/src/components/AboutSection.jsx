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
    <div id="about" style={{ padding: '5rem 1.25rem', width: '100%' }} className="sm:py-24 scroll-animate">
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Main Content Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }}>
          
          {/* Left Text Column */}
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '0.75rem', fontSize: '13px' }}>
              Our Philosophy
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5.5vw, 40px)',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem'
            }}>
              Designed to help educators focus on what matters most
            </h2>
            <p style={{
              fontSize: '14.5px',
              color: '#4b5563',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              EduNest was born out of a simple challenge faced by modern educators: the administrative burden of running tuition classes. Coordinating lecture schedules, tracking student attendance, managing pending tuition fees, and processing teacher payroll can quickly become overwhelming.
            </p>
            <p style={{
              fontSize: '14.5px',
              color: '#4b5563',
              lineHeight: 1.6
            }}>
              Our software automates these repeating manual operations. By providing beautiful, clean dashboards coupled with highly secured Supabase databases, we empower tuition business owners to run organized, efficient, and scaling educational enterprises.
            </p>
          </div>

          {/* Right Cards Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cards.map((card, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
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
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.45 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
