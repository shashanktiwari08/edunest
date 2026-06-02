import { 
  Users, Calendar, IndianRupee, Radio, ShieldAlert, Award, Clock, Sparkles, School, BookOpen
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
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 233, 0.4) 100%)',
        borderRadius: '32px',
        padding: '3.5rem 2rem',
        maxWidth: '1024px',
        margin: '0 auto',
        border: '1px solid rgba(239, 77, 35, 0.12)',
        boxShadow: '0 20px 40px -15px rgba(239, 77, 35, 0.05)'
      }} className="sm:p-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <Sparkles size={20} color="#ef4d23" className="pulse-spark" />
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#ef4d23', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>
            Who uses EduNest?
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {usecases.map((use, idx) => {
            // Curated design variables for each target case
            const themes = [
              { color: '#ef4d23', bg: '#fdf2e9', badge: 'Academy Level', icon: <School size={16} /> },
              { color: '#3b82f6', bg: '#eff6ff', badge: 'Personal Level', icon: <Users size={16} /> },
              { color: '#10b981', bg: '#ecfdf5', badge: 'Creative Level', icon: <BookOpen size={16} /> }
            ];
            const activeTheme = themes[idx] || themes[0];
            return (
              <div 
                key={idx} 
                className="usecase-card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  padding: '2.25rem 1.75rem',
                  borderRadius: '24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Horizontal line banner matching active theme */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: activeTheme.color }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: activeTheme.bg,
                    color: activeTheme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activeTheme.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: activeTheme.color, letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}>
                    {activeTheme.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: '0.25rem 0 0 0', fontFamily: 'var(--font-display)' }}>
                  {use.title}
                </h4>
                <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  {use.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: #ef4d23 !important;
          box-shadow: 0 12px 20px -5px rgba(239, 77, 35, 0.05) !important;
        }
        .usecase-card:hover {
          transform: translateY(-5px);
          border-color: #ef4d23 !important;
          box-shadow: 0 15px 30px rgba(239, 77, 35, 0.08) !important;
        }
        .pulse-spark {
          animation: spark-pulse 2s infinite ease-in-out;
        }
        @keyframes spark-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
