import React, { useState } from 'react';
import { 
  UserPlus, Users, ClipboardList, CreditCard, BarChart2, MessageSquare, 
  Check, Star, Shield, ArrowRight
} from 'lucide-react';

export default function DashboardPreview() {
  // State for interactive demo submissions
  const [admissionSaved, setAdmissionSaved] = useState(false);
  const [batchAssigned, setBatchAssigned] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div style={{ width: '100%', padding: '0.5rem' }} className="font-sans">
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '3rem 2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
        border: '1px solid rgba(255,255,255,0.7)',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }} className="sm:p-12">
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.03em',
            margin: '0 0 1rem 0',
            lineHeight: 1.15
          }}>
            A Seamless Workflow for Your Academy
          </h2>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: '#475569',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            From admission to results and beyond – EduNest automates every step so you can focus on what matters most: teaching.
          </p>
        </div>

        {/* 6 Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          boxSizing: 'border-box',
          marginBottom: '3rem'
        }} className="workflow-grid">
          
          {/* COLUMN 1: Student Admission */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Circle Badge Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>1</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
              }}>
                <UserPlus size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Student Admission
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Add student details, documents, and admission info seamlessly.
              </p>
            </div>

            {/* Inner Interactive Card */}
            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                New Admission
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Student Name</label>
                  <input type="text" readOnly value="Rohan Sharma" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Grade / Class</label>
                  <input type="text" readOnly value="Class 10" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Phone Number</label>
                  <input type="text" readOnly value="98765 43210" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
              </div>

              <button 
                onClick={() => {
                  setAdmissionSaved(true);
                  setTimeout(() => setAdmissionSaved(false), 2000);
                }}
                style={{
                  width: '100%',
                  backgroundColor: admissionSaved ? '#22c55e' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {admissionSaved ? <Check size={12} strokeWidth={3} /> : null}
                {admissionSaved ? 'Saved successfully' : 'Save Admission'}
              </button>
            </div>
          </div>

          {/* COLUMN 2: Batch Assignment */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>2</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(22,163,74,0.08)'
              }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Batch Assignment
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Assign students to the right batches & teachers instantly.
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Assign to Batch
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Student</label>
                  <input type="text" readOnly value="Rohan Sharma" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Batch</label>
                  <input type="text" readOnly value="Class 10 - Science" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Teacher</label>
                  <input type="text" readOnly value="Anita Verma" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: '#334155', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
              </div>

              <button 
                onClick={() => {
                  setBatchAssigned(true);
                  setTimeout(() => setBatchAssigned(false), 2000);
                }}
                style={{
                  width: '100%',
                  backgroundColor: batchAssigned ? '#22c55e' : '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {batchAssigned ? <Check size={12} strokeWidth={3} /> : null}
                {batchAssigned ? 'Assigned Successfully' : 'Assign Batch'}
              </button>
            </div>
          </div>

          {/* COLUMN 3: Attendance Tracking */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>3</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(234,88,12,0.08)'
              }}>
                <ClipboardList size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Attendance Tracking
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Take attendance in seconds and get real-time student insights.
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today's Attendance
              </span>

              {/* Dynamic Pie Chart Representation */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem 0' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ea580c" strokeWidth="3.2" strokeDasharray="92 8" strokeDashoffset="0" />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>92%</span>
                    <span style={{ fontSize: '8px', color: '#64748b', fontWeight: '600' }}>Present</span>
                  </div>
                </div>
              </div>

              {/* Attendance metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ea580c' }} /> Present
                  </span>
                  <span style={{ fontWeight: '700' }}>46</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e2e8f0' }} /> Absent
                  </span>
                  <span style={{ fontWeight: '700' }}>4</span>
                </div>
              </div>

              <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '700', textAlign: 'center', cursor: 'pointer', marginTop: '4px' }}>
                View Attendance →
              </span>
            </div>
          </div>

          {/* COLUMN 4: Fee Collection */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>4</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#f5f3ff',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139,92,246,0.08)'
              }}>
                <CreditCard size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Fee Collection
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Generate invoices, collect fees, and send automated reminders.
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Fee Overview
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Total Due</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹1,25,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Collected</span>
                  <span style={{ fontWeight: '700', color: '#16a34a' }}>₹98,500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>Pending</span>
                  <span style={{ fontWeight: '700', color: '#dc2626' }}>₹26,500</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '700', color: '#64748b', marginBottom: '2px' }}>
                  <span>Collection Rate</span>
                  <span>78%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '9999px' }} />
                </div>
              </div>

              <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: '700', textAlign: 'center', cursor: 'pointer', marginTop: '6px' }}>
                View Fee Details →
              </span>
            </div>
          </div>

          {/* COLUMN 5: Performance Reports */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ec4899',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>5</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#fdf2f8',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(236,72,153,0.08)'
              }}>
                <BarChart2 size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Performance Reports
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Analyze student scores, generate reports, & track progress.
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Test Performance
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Average Score</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>78%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Highest Score</span>
                  <span style={{ fontWeight: '700', color: '#16a34a' }}>96%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Lowest Score</span>
                  <span style={{ fontWeight: '700', color: '#dc2626' }}>42%</span>
                </div>
              </div>

              {/* Area graph path */}
              <div style={{ height: '40px', marginTop: '4px', position: 'relative' }}>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path d="M0,25 Q15,10 30,18 T60,5 T90,12 T100,10 L100,30 L0,30 Z" fill="rgba(236,72,153,0.12)" />
                  <path d="M0,25 Q15,10 30,18 T60,5 T90,12 T100,10" fill="none" stroke="#ec4899" strokeWidth="1.8" />
                </svg>
              </div>

              <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: '700', textAlign: 'center', cursor: 'pointer', marginTop: '2px' }}>
                View Reports →
              </span>
            </div>
          </div>

          {/* COLUMN 6: Parent Notifications */}
          <div className="workflow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0ea5e9',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>6</div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#f0f9ff',
                color: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(14,165,233,0.08)'
              }}>
                <MessageSquare size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                Parent Notifications
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0, maxWidth: '200px', lineHeight: '1.4' }}>
                Keep parents informed with real-time updates and SMS reminders.
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recent Notifications
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '9px', color: '#475569' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0ea5e9', marginTop: '4px' }} />
                  <div>
                    <span style={{ fontWeight: '700', color: '#0f172a', display: 'block' }}>Attendance Alert</span>
                    <span style={{ color: '#94a3b8' }}>Today, 10:30 AM</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0ea5e9', marginTop: '4px' }} />
                  <div>
                    <span style={{ fontWeight: '700', color: '#0f172a', display: 'block' }}>Fee Reminder</span>
                    <span style={{ color: '#94a3b8' }}>Today, 09:15 AM</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0ea5e9', marginTop: '4px' }} />
                  <div>
                    <span style={{ fontWeight: '700', color: '#0f172a', display: 'block' }}>Test Result Published</span>
                    <span style={{ color: '#94a3b8' }}>Yesterday, 08:45 PM</span>
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '700', textAlign: 'center', cursor: 'pointer', marginTop: '4px' }}>
                See All Notifications →
              </span>
            </div>
          </div>

        </div>

        {/* Dynamic Connected Ribbon Footer */}
        <div style={{
          backgroundColor: '#2563eb',
          borderRadius: '20px',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(37,99,235,0.15)',
          boxSizing: 'border-box'
        }} className="workflow-ribbon">
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Star size={14} fill="#ffffff" stroke="none" />
          </div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '1.4',
            textAlign: 'center'
          }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#eff6ff', marginRight: '6px' }}>Everything Connected, Everything Automated |</span>
            EduNest brings all your academic and administrative tasks together in one powerful platform.
          </p>
        </div>

      </div>

      {/* Styled Grid for responsive views */}
      <style>{`
        @media (max-width: 768px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .workflow-ribbon {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
