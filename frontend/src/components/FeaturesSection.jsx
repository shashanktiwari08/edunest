import React from 'react';
import { 
  Users, Calendar, IndianRupee, Radio, ShieldAlert, Award, Clock, Sparkles 
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Radio size={24} />,
      title: 'Real-Time WebSocket Alerts',
      desc: 'Instantly notify students and parents when teachers schedule classes, post announcements, or mark leaves. Zero latency push system.'
    },
    {
      icon: <Users size={24} />,
      title: 'Multi-Role Custom Portals',
      desc: 'Dedicated and optimized dashboards tailored for Admins, Teachers, and Students. Clean separation of controls and statistics.'
    },
    {
      icon: <IndianRupee size={24} />,
      title: 'Automated 30-Day Ledger Cycles',
      desc: 'Automatically rolls over student tuition fees and teacher salaries every 30 days. Archives histories and creates new billings automatically.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Intuitive Attendance Sheets',
      desc: 'Teachers can record roll-call attendance registers in seconds. Students get instant visual stats on their monthly attendance rates.'
    },
    {
      icon: <ShieldAlert size={24} />,
      title: 'Security Credentials Override',
      desc: 'Admins retain master authority to securely override user credentials, passwords, and active mobile numbers instantly.'
    },
    {
      icon: <Award size={24} />,
      title: 'Interactive Academic Feeds',
      desc: 'Live feed arrays highlight imminent next-up classes, date parameters, and syllabus topics so students never miss a lecture.'
    }
  ];

  const usecases = [
    {
      title: 'Coaching Institutes',
      desc: 'Scale batch configurations, manage professional teacher rosters, track syllabus progress, and handle bulk monthly student billing cycles.'
    },
    {
      title: 'Private Home Tutors',
      desc: 'Monitor individual student profiles, log daily attendance sheets, track pending hourly/monthly fee balances, and share notices.'
    },
    {
      title: 'Hobby & Art Academies',
      desc: 'Easily schedule lessons, manage class timetables, automate recurring fee collection, and maintain clean logs.'
    }
  ];

  return (
    <div id="features" style={{ padding: '5rem 1.25rem', width: '100%' }} className="sm:py-24 scroll-animate">
      
      {/* Header */}
      <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem', fontSize: '13px' }}>
          Platform Highlights
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 42px)',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Everything you need to scale your academy
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 17px)',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          Ditch manual registers and paper billing. EduNest brings modern automated workflows directly to your tuition operations.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1024px',
        margin: '0 auto 5rem auto'
      }}>
        {features.map((feat, idx) => (
          <div 
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e5e5e5',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              transition: 'transform 0.3s, border-color 0.3s',
              cursor: 'default'
            }}
            className="feature-card"
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fdf2e9',
              color: '#ef4d23',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              {feat.icon}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.5 }}>
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Use Cases */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem',
        maxWidth: '1024px',
        margin: '0 auto',
        border: '1px solid #e5e5e5'
      }} className="sm:p-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Sparkles size={18} color="#ef4d23" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#ef4d23', letterSpacing: '0.05em' }}>
            Who uses EduNest?
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          textAlign: 'center'
        }}>
          {usecases.map((use, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{use.title}</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.4, maxWidth: '280px', margin: '0 auto' }}>
                {use.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: #ef4d23 !important;
          box-shadow: 0 12px 20px -5px rgba(239, 77, 35, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
