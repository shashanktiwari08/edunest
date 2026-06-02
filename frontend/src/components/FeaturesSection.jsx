import { 
  Users, Calendar, IndianRupee, Radio, ShieldAlert, Award, Clock, School, BookOpen, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Radio size={22} />,
      title: 'Real-Time WebSocket Alerts',
      desc: 'Instantly notify students and parents when teachers schedule classes, post announcements, or mark leaves. Zero latency push system.'
    },
    {
      icon: <Users size={22} />,
      title: 'Multi-Role Custom Portals',
      desc: 'Dedicated and optimized dashboards tailored for Admins, Teachers, and Students. Clean separation of controls and statistics.'
    },
    {
      icon: <IndianRupee size={22} />,
      title: 'Automated 30-Day Ledger Cycles',
      desc: 'Automatically rolls over student tuition fees and teacher salaries every 30 days. Archives histories and creates new billings automatically.'
    },
    {
      icon: <Calendar size={22} />,
      title: 'Intuitive Attendance Sheets',
      desc: 'Teachers record roll-call attendance in seconds. Students get instant visual stats on their monthly attendance rates.'
    },
    {
      icon: <ShieldAlert size={22} />,
      title: 'Security Credentials Override',
      desc: 'Admins retain master authority to securely override user credentials, passwords, and active mobile numbers instantly.'
    },
    {
      icon: <Award size={22} />,
      title: 'Interactive Academic Feeds',
      desc: 'Live feed arrays highlight imminent next-up classes, date parameters, and syllabus topics so students never miss a lecture.'
    }
  ];

  const usecases = [
    {
      title: 'Coaching Institutes',
      subtitle: 'Academy Level',
      desc: 'Scale batch configurations, manage professional teacher rosters, track syllabus progress, and handle bulk monthly student billing cycles.',
      points: ['Multi-teacher batch management', 'Bulk fee billing cycles', 'Syllabus progress tracking'],
      icon: <School size={28} />,
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #ef4d23 100%)',
      lightBg: '#fff5f2',
      accentColor: '#ef4d23'
    },
    {
      title: 'Private Home Tutors',
      subtitle: 'Personal Level',
      desc: 'Monitor individual student profiles, log daily attendance sheets, track pending hourly and monthly fee balances, and share notices.',
      points: ['Individual student tracking', 'Daily attendance logging', 'Fee balance management'],
      icon: <Users size={28} />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      lightBg: '#eff6ff',
      accentColor: '#3b82f6'
    },
    {
      title: 'Hobby & Art Academies',
      subtitle: 'Creative Level',
      desc: 'Easily schedule lessons, manage class timetables, automate recurring fee collection, and maintain clean administrative logs.',
      points: ['Class timetable scheduling', 'Recurring fee automation', 'Clean admin logs'],
      icon: <BookOpen size={28} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      lightBg: '#ecfdf5',
      accentColor: '#10b981'
    }
  ];

  const stats = [
    { value: '3+', label: 'User Roles' },
    { value: '30-Day', label: 'Auto Billing Cycle' },
    { value: '100%', label: 'Cloud-Based' },
    { value: 'Real-Time', label: 'Live Sync' }
  ];

  return (
    <div id="features" style={{ padding: '5rem 1.25rem', width: '100%' }} className="sm:py-24 scroll-animate">
      
      {/* Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem', fontSize: '13px' }}>
          Platform Highlights
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: '1rem'
        }}>
          Everything you need to scale your academy
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 17px)',
          color: '#64748b',
          maxWidth: '580px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Ditch manual registers and paper billing. EduNest brings modern automated workflows directly to your tuition operations.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1100px',
        margin: '0 auto 6rem auto'
      }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="feature-card"
          >
            {/* subtle number watermark */}
            <span style={{
              position: 'absolute',
              top: '1rem',
              right: '1.25rem',
              fontSize: '48px',
              fontWeight: '900',
              color: '#f8fafc',
              lineHeight: 1,
              userSelect: 'none'
            }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff6b35, #ef4d23)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 16px rgba(239, 77, 35, 0.25)'
            }}>
              {feat.icon}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.5rem',
              lineHeight: 1.3
            }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* WHO USES EDUNEST — Dark dramatic section */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        borderRadius: '32px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        position: 'relative'
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(239,77,35,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '15%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', padding: '4rem 3rem' }}>
          
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 77, 35, 0.15)',
              border: '1px solid rgba(239, 77, 35, 0.3)',
              borderRadius: '9999px',
              padding: '6px 16px',
              marginBottom: '1.25rem'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ef4d23',
                display: 'inline-block',
                boxShadow: '0 0 6px rgba(239,77,35,0.8)',
                animation: 'ping-dot 2s infinite'
              }} />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fb8a6e' }}>
                Who uses EduNest
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 5vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 auto',
              maxWidth: '600px'
            }}>
              Built for every type of educator
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '0.75rem' }}>
              From solo tutors to large coaching networks
            </p>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '3.5rem',
            border: '1px solid rgba(255,255,255,0.06)'
          }} className="stats-grid-mobile">
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '1.5rem 1rem',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.03)'
              }}>
                <div style={{
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  fontWeight: '800',
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Use case cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {usecases.map((use, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="usecase-dark-card"
              >
                {/* bottom glow on hover */}
                <div className={`use-glow-${idx}`} style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '60px',
                  background: use.gradient,
                  borderRadius: '50%',
                  filter: 'blur(25px)',
                  opacity: 0,
                  transition: 'opacity 0.4s'
                }} />

                {/* Icon + badge row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: use.gradient,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 20px rgba(0,0,0,0.3)`
                  }}>
                    {use.icon}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: use.accentColor,
                    backgroundColor: `${use.accentColor}20`,
                    border: `1px solid ${use.accentColor}30`,
                    borderRadius: '9999px',
                    padding: '4px 10px'
                  }}>
                    {use.subtitle}
                  </span>
                </div>

                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '-0.01em'
                  }}>
                    {use.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.65', margin: 0 }}>
                    {use.desc}
                  </p>
                </div>

                {/* Bullet points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {use.points.map((pt, pi) => (
                    <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} style={{ color: use.accentColor, flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(239, 77, 35, 0.2) !important;
          box-shadow: 0 20px 40px -10px rgba(239, 77, 35, 0.1) !important;
        }
        .usecase-dark-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.18) !important;
          background-color: rgba(255,255,255,0.07) !important;
        }
        .usecase-dark-card:hover .use-glow-0,
        .usecase-dark-card:hover .use-glow-1,
        .usecase-dark-card:hover .use-glow-2 {
          opacity: 0.5;
        }
        @keyframes ping-dot {
          0%, 100% { box-shadow: 0 0 6px rgba(239,77,35,0.8); }
          50% { box-shadow: 0 0 14px rgba(239,77,35,1); }
        }
        @media (max-width: 600px) {
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
