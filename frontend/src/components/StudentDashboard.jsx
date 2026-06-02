import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, IndianRupee, Award, AlertCircle, Clock, MessageSquare, LayoutDashboard } from 'lucide-react';
import CommunityChat from './CommunityChat';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

export default function StudentDashboard() {
  // Sub-tab selection state
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard' | 'chat'

  // Aggregate Data state
  const [dashboardData, setDashboardData] = useState({
    scheduleFeed: [],
    attendance: {
      totalClasses: 0,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      attendanceRate: 100.0,
    },
    finances: {
      amount_total: 0,
      amount_paid: 0,
      amount_pending: 0,
      due_date: 'N/A',
      status: 'paid',
    },
    batches: [],
    notifications: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/student/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Loading dashboard aggregates...
      </div>
    );
  }

  const { scheduleFeed, attendance, finances, batches = [], notifications = [] } = dashboardData;

  // Compute circular SVG progress values
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendance.attendanceRate / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Tab Navigation Controls */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        inlineSize: 'fit-content'
      }}>
        <button
          onClick={() => setActiveSubTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'dashboard' ? '#4f46e5' : 'transparent',
            color: activeSubTab === 'dashboard' ? '#ffffff' : '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <LayoutDashboard size={16} /> Operations Console
        </button>
        <button
          onClick={() => setActiveSubTab('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'chat' ? '#4f46e5' : 'transparent',
            color: activeSubTab === 'chat' ? '#ffffff' : '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquare size={16} /> Batch Communities ({batches.length})
        </button>
      </div>

      {activeSubTab === 'chat' ? (
        <CommunityChat customBatches={batches} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* 1. FINANCIAL TRACKER BANNER */}
      <div 
        className="card"
        style={{
          background: finances.status === 'not_pending'
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
            : finances.amount_pending > 0 
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)' 
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          borderLeft: `5px solid ${finances.status === 'not_pending' ? 'var(--accent)' : finances.amount_pending > 0 ? 'var(--danger)' : 'var(--success)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div 
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: finances.status === 'not_pending' ? 'var(--accent-light)' : finances.amount_pending > 0 ? 'var(--danger-light)' : 'var(--success-light)',
              color: finances.status === 'not_pending' ? 'var(--accent)' : finances.amount_pending > 0 ? 'var(--danger)' : 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IndianRupee size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
              {finances.status === 'not_pending' ? 'Tuition Fees: Not Pending' : finances.amount_pending > 0 ? 'Tuition Balance Pending' : 'Tuition Fees Fully Settled'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {finances.status === 'not_pending'
                ? 'Your tuition fee status has been marked as Not Pending by the Admin.'
                : finances.amount_pending > 0 
                  ? `Please settle pending tuition fees by the contract deadline: ${finances.due_date}` 
                  : 'Thank you for your timely contract fee settlement!'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
              Pending Balance
            </span>
            <h2 style={{ fontSize: '1.85rem', color: finances.status === 'not_pending' ? 'var(--accent)' : finances.amount_pending > 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-display)' }}>
              ₹{finances.amount_pending.toFixed(2)}
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
              Amount Settled
            </span>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
              ₹{finances.amount_paid.toFixed(2)}
            </h2>
          </div>

          <span className={`badge badge-${finances.status === 'paid' ? 'success' : finances.status === 'not_pending' ? 'accent' : 'warning'}`} style={{ height: 'fit-content' }}>
            {finances.status === 'not_pending' ? 'Not Pending' : finances.status}
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* 2. LIVE SCHEDULE FEED */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen style={{ color: 'var(--accent)' }} /> Live Academic Feed
          </h2>

          <div className="feed-container">
            {scheduleFeed.map((lecture, index) => {
              // Highlight the first element (most imminent class)
              const isImminent = index === 0;

              return (
                <div 
                  key={lecture.id} 
                  className={`card feed-item ${isImminent ? 'imminent' : ''}`}
                  style={{ padding: '1.25rem' }}
                >
                  <div className="feed-item-header">
                    <div>
                      <span className="badge badge-accent" style={{ marginBottom: '0.5rem', textTransform: 'none' }}>
                        {lecture.batch_name}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', marginTop: '0.25rem' }}>{lecture.topic}</h3>
                    </div>

                    {isImminent && (
                      <span className="badge badge-warning" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <Clock size={12} /> Next Up
                      </span>
                    )}
                  </div>

                  <div className="feed-time-banner" style={{ marginTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {lecture.date}
                    </span>
                    <span>•</span>
                    <span>Window: {lecture.start_time} - {lecture.end_time}</span>
                  </div>
                </div>
              );
            })}

            {scheduleFeed.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No active lectures scheduled for your batches.
              </div>
            )}
          </div>
        </div>

        {/* 3. ATTENDANCE RADAR CARD */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--accent)' }} /> Academic Attendance Rate
            </h2>

            {/* Circular Gauge */}
            <div className="circular-progress-container" style={{ margin: '2rem auto' }}>
              <svg className="circle-svg">
                <circle className="circle-bg" cx="75" cy="75" r={radius} />
                <circle 
                  className="circle-bar" 
                  cx="75" 
                  cy="75" 
                  r={radius} 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="circular-percentage">
                {attendance.attendanceRate}%
              </div>
            </div>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              textAlign: 'center', 
              borderTop: '1px solid var(--border)', 
              paddingTop: '1.5rem',
              gap: '0.5rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present</span>
              <h4 style={{ fontSize: '1.35rem', color: 'var(--success)', marginTop: '0.25rem' }}>{attendance.presentDays}</h4>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Late</span>
              <h4 style={{ fontSize: '1.35rem', color: 'var(--warning)', marginTop: '0.25rem' }}>{attendance.lateDays}</h4>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Absent</span>
              <h4 style={{ fontSize: '1.35rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{attendance.absentDays}</h4>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Held</span>
              <h4 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>{attendance.totalClasses}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ENROLLED BATCHES & NOTIFICATION CHRONOLOGY BOARDS */}
      <div className="grid-2">
        {/* Enrolled Batches Panel */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award style={{ color: 'var(--accent)' }} /> Active Batches Enrolled
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
            {batches.map((b) => (
              <div 
                key={b.id} 
                className="checklist-item"
                style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-primary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{b.batch_name}</h3>
                  <span className="badge badge-accent" style={{ textTransform: 'none' }}>👨‍🏫 {b.teacher_name}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  📅 Schedule: {b.schedule_description}
                </p>
              </div>
            ))}
            {batches.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                You are not enrolled in any academic batches yet.
              </div>
            )}
          </div>
        </div>

        {/* Notices Board Panel */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle style={{ color: 'var(--accent)' }} /> Academic Notification Board
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.map((n) => {
              const formattedDate = new Date(n.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              return (
                <div 
                  key={n.id} 
                  className="card feed-item"
                  style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-accent" style={{ textTransform: 'none' }}>📢 {n.batch_name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🕒 {formattedDate}</span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No academic notices received from your teachers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
